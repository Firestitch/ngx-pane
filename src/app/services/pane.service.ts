import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { ComponentsItem } from '../interfaces';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class FsPane {

  private _components$ = new ReplaySubject<Map<string, ComponentsItem>>(1, 200);
  private _componentsStore = new Map<string, ComponentsItem>();

  constructor() {}

  get components$() {
    return this._components$.asObservable();
  }

  public create(name: string, component: ComponentType<any>, data: any) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.delete(name);
    }

    debugger;
    this._componentsStore.set(name, {
      component: component,
      data: data,
      hidden: false,
    });

    this._updateComponents();
  }

  public destroy(name: string) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.delete(name);
    }

    this._updateComponents();
  }

  public show(name: string) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.get(name).hidden = false;
    }

    this._updateComponents();
  }

  public hide(name: string) {
    if (this._componentsStore.has(name)) {
      this._componentsStore.get(name).hidden = true;
    }

    this._updateComponents();
  }

  private _updateComponents() {
    this._components$.next(this._componentsStore);
  }
}
