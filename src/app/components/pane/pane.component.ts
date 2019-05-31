import {
  Component,
  EventEmitter,
  HostBinding,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsPane } from '../../services/pane.service';
import { PANE_DATA } from '../../services/pane-data'


@Component({
  selector: 'fs-pane',
  templateUrl: 'pane.component.html',
  styleUrls: [ 'pane.component.scss' ],
})
export class FsPaneComponent implements OnInit, OnDestroy {

  @Input()
  public name: string;

  @Output()
  public visibilityChanged = new EventEmitter<boolean>();

  @HostBinding('class.hidden')
  public hidden = false;

  public alive = false;
  public component: any;
  public componentInjector: any;

  private _destroy$ = new Subject<void>();

  constructor(private _injector: Injector, private _pane: FsPane) {}

  public ngOnInit() {
    this._subscribeToUpdates();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _subscribeToUpdates() {
    this._pane.components$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((components) => {
        this._componentsChanged(components);
      })
  }

  private _componentsChanged(components) {
    const componentData = components.get(this.name);

    if (componentData) {
      // Create component
      if (!this.alive) {
        this._initInjector(componentData.data);
        this.component = componentData.component;

        this.alive = true;
        this.hidden = componentData.hidden;
      } else {
        this.hidden = componentData.hidden;
      }
    } else {
      // Destroy component by ngIf
      if (this.alive) {
        this.alive = false;
      }
    }
  }

  private _initInjector(data: any) {
    this.componentInjector = Injector.create({
      providers: [
        {
          provide: PANE_DATA,
          useValue: data,
        }
      ],
      parent: this._injector,
    })
  }

}
