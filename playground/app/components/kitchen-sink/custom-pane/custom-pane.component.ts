import { Component, Inject } from '@angular/core';
import { PANE_DATA } from '@firestitch/pane';

@Component({
  templateUrl: './custom-pane.component.html',
})
export class CustomPaneComponent {
  constructor(@Inject(PANE_DATA) public data: any) {
  }
}
