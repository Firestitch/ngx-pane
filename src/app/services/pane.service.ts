import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ComponentsItem } from '../interfaces';
import {
  FsPaneStateChangeEvent,
  FsPaneStateChangeType
} from '../interfaces/state-change-event.interface';
import { FsPaneComponent } from '../components/pane/pane.component';
import { FsPaneRef } from '../classes/pane.ref';


@Injectable()
export class FsPane {

  // If method create/show/hide/destroy was called - components$ event will notify all panes about this update
  private _components$ = new ReplaySubject<Map<string, ComponentsItem>>(1, 200);
  // External notifier about updates like content, orientation and etc.
  private _componentStateChange$ = new Subject<FsPaneStateChangeEvent>();

  private _componentsStore = new Map<string, ComponentsItem>();
  private _componentRefsStore = new Map<string, FsPaneRef>();

  private _renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    private _breakpointObserver: BreakpointObserver,
  ) {
    this._renderer = rendererFactory.createRenderer(null, null);
    this._listenHandsetChange();
  }

  get components$(): Observable<Map<string, ComponentsItem>> {
    return this._components$.asObservable();
  }

  // Listen component changes
  public componentChanges$(name: string) {
    return this._componentStateChange$.pipe(
      filter((event) => event.name === name)
    )
  }

  // Listen all components changes
  public componentsChanges$(): Observable<FsPaneStateChangeEvent> {
    return this._componentStateChange$.asObservable();
  }

  /**
   * If passed event type related with content modifiers. Ex: destroy or hide it is not modifier
   * @param eventType
   */
  public paneModifiedType(eventType: FsPaneStateChangeType) {
    return [
      FsPaneStateChangeType.Created,
      FsPaneStateChangeType.OrientationChanged,
      FsPaneStateChangeType.Shown,
      FsPaneStateChangeType.ContentChanged,
    ].indexOf(eventType) > -1;
  }

  /**
   * Create new pane with passed component
   * @param name
   * @param component
   * @param data
   */
  public create(name: string, component: ComponentType<any>, data: any) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.delete(name);
    }

    this._componentsStore.set(name, {
      component: component,
      data: data,
      hidden: false,
    });

    this._addComponentGlobalClass(name);
    this._updateGlobalClass();
    this._updateComponents();

    this._changeState(name, FsPaneStateChangeType.Created);

    return this.getPaneRef(name);
  }

  /**
   * Full destroy pane
   * @param name
   */
  public destroy(name: string) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.delete(name);
    }

    this._removeComponentGlobalClass(name);
    this._updateGlobalClass();
    this._updateComponents();

    this._changeState(name, FsPaneStateChangeType.Destroyed);
  }

  /**
   * Show pane
   * @param name
   */
  public show(name: string) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.get(name).hidden = false;
    }

    this._addComponentGlobalClass(name);
    this._updateGlobalClass();
    this._updateComponents();

    this._changeState(name, FsPaneStateChangeType.Shown);

    return this.getPaneRef(name);
  }

  /**
   * Hide pane
   * @param name
   */
  public hide(name: string) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.get(name).hidden = true;
    }

    this._removeComponentGlobalClass(name);
    this._updateGlobalClass();
    this._updateComponents();

    this._changeState(name, FsPaneStateChangeType.Hidden);
  }

  /**
   * Get pane reference to listen
   * @param name
   */
  public getPaneRef(name: string) {
    return this._componentRefsStore.get(name);
  }

  /**
   * Register FsPane component container and create Pane Reference
   * @param name
   * @param component
   */
  public registerPaneComponent(name: string, component: FsPaneComponent) {
    if (this._componentRefsStore.has(name)) {
      throw Error(`FsPane component with name ${name} already exists!`);
    }

    const paneRef = new FsPaneRef(component, this._componentStateChange$);

    this._componentRefsStore.set(name, paneRef);

    return paneRef;
  }

  /**
   * Remove pane component
   * @param name
   */
  public removePaneComponent(name: string) {
    this._componentRefsStore.delete(name);
  }

  /**
   * Notify that state for component was changed with some type
   * @param name
   * @param type
   */
  private _changeState(name: string, type: FsPaneStateChangeType) {
    this._componentStateChange$.next({
      name,
      type,
    });
  }

  private _updateGlobalClass() {
    const hasOpenedPanes = Array.from(this._componentsStore.values()).some((component) => {
      return !component.hidden;
    });

    if (hasOpenedPanes) {
      this._renderer.addClass(document.body, 'fs-pane-open');
    } else {
      this._renderer.removeClass(document.body, 'fs-pane-open');
    }
  }

  private _addComponentGlobalClass(name: string) {
    this._renderer.addClass(document.body, `fs-pane-open-${name}`);
  }

  private _removeComponentGlobalClass(name: string) {
    this._renderer.removeClass(document.body, `fs-pane-open-${name}`);
  }

  private _updateComponents() {
    this._components$.next(this._componentsStore);
  }

  /**
   * Orientation changes
   */
  private _listenHandsetChange() {
    this._breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this._componentsStore.forEach((el, key) => {
        if (!el.hidden) {
          this._changeState(key, FsPaneStateChangeType.OrientationChanged);
        }
      })
    });
  }
}
