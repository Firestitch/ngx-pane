import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsPaneComponent } from './components/pane/pane.component';
import { FsPane } from './services/pane.service';


@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsPaneComponent,
  ],
  entryComponents: [
  ],
  declarations: [
    FsPaneComponent,
  ],
})
export class FsPaneModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsPaneModule,
      providers: [ FsPane ]
    };
  }
}
