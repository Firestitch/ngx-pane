import { Component, Inject } from '@angular/core';
import { PANE_DATA } from '@firestitch/pane';

@Component({
  templateUrl: './custom-pane.component.html',
})
export class CustomPaneComponent {
  public da = '';
  constructor(@Inject(PANE_DATA) public data: any) {
    (window as any).cock = (val) => {
      this.da = val;
    }
  }
}
