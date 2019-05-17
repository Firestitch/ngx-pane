import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsPane, PANE_DATA } from '../../services';


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

  public visibile = false;
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
        const hasComponentData = components.has(this.name);

        if (hasComponentData && !this.visibile) {
          const config = components.get(this.name);

          this._initInjector(config.data);
          this.component = config.component;

          this.visibile = true;
          this.visibilityChanged.emit(this.visibile);
        } else if (!hasComponentData && this.visibile) {
          this.visibile = false;
          this.visibilityChanged.emit(this.visibile);
        }
      })
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
