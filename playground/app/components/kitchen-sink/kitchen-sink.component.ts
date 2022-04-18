import { Component } from '@angular/core';
import { FsExampleComponent } from '@firestitch/example';

import { FsPane } from '@firestitch/pane';

import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';

@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent {

  constructor(private exampleComponent: FsExampleComponent, private _pane: FsPane) {
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, {});
  }
}
