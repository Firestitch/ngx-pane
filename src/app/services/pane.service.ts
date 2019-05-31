import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { Observable, ReplaySubject } from 'rxjs';

import { ComponentsItem } from '../interfaces';


@Injectable()
export class FsPane {

  private _components$ = new ReplaySubject<Map<string, ComponentsItem>>(1, 200);
  private _componentsStore = new Map<string, ComponentsItem>();

  private _renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  get components$(): Observable<Map<string, ComponentsItem>> {
    return this._components$.asObservable();
  }

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
  }

  public destroy(name: string) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.delete(name);
    }

    this._removeComponentGlobalClass(name);
    this._updateGlobalClass();
    this._updateComponents();
  }

  public show(name: string) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.get(name).hidden = false;
    }

    this._addComponentGlobalClass(name);
    this._updateGlobalClass();
    this._updateComponents();
  }

  public hide(name: string) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.get(name).hidden = true;
    }

    this._removeComponentGlobalClass(name);
    this._updateGlobalClass();
    this._updateComponents();
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
}
