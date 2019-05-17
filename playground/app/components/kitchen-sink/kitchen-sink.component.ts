import { Component } from '@angular/core';
import { FsExampleComponent } from '@firestitch/example';

import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';

@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent {

  constructor(private exampleComponent: FsExampleComponent) {
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, {});
  }
}
