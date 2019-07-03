import { Subject } from 'rxjs';
import { FsPaneComponent } from '../components/pane/pane.component';

import {
  FsPaneStateChangeEvent,
  FsPaneStateChangeType
} from '../interfaces/state-change-event.interface';


export class FsPaneRef {

  constructor(
    private _paneComponent: FsPaneComponent,
    private _componentChangesNotifier$: Subject<FsPaneStateChangeEvent>
  ) {}

  get elementRef() {
    return this._paneComponent.el.nativeElement;
  }

  public contentChanged() {
    if (this._paneComponent.alive) {
      this._componentChangesNotifier$.next({
        name: this._paneComponent.name,
        type: FsPaneStateChangeType.ContentChanged,
      });
    }
  }
}
