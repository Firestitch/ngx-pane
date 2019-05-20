import { Component, Inject } from '@angular/core';
import { DrawerRef, DRAWER_DATA } from '@firestitch/drawer';
import { ExampleService } from '@firestitch/example';
import { FsPane } from '@firestitch/pane';
import { CustomPaneComponent } from '../kitchen-sink/custom-pane/custom-pane.component';


@Component({
  templateUrl: './kitchen-sink-configure.component.html',
  styleUrls: ['./kitchen-sink-configure.component.scss']
})
export class KitchenSinkConfigureComponent {

  public config;
  public example: ExampleService;
  public paneHidden = false;
  public paneCreated = false;

  constructor(
    public drawer: DrawerRef<KitchenSinkConfigureComponent>,
    @Inject(DRAWER_DATA) public data,
    private pane: FsPane,
  ) {
    this.config = data.config;
    this.example = data.example;
  }

  reload() {
    this.data.example.reload();
  }

  public togglePaneVisibility() {
    if (this.paneHidden) {
      this.pane.show('test');
      this.paneHidden = false;
    } else {
      this.pane.hide('test');
      this.paneHidden = true;
    }
  }

  public createOrDescroyPane() {
    if (!this.paneCreated) {
      this.pane.create('test', CustomPaneComponent, { super: 'test' });
      this.paneCreated = true;
    } else {
      this.pane.destroy('test');
      this.paneCreated = false;
      this.paneHidden = false;
    }
  }
}
