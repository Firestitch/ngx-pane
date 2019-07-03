import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObserversModule } from '@angular/cdk/observers';
import { LayoutModule } from '@angular/cdk/layout';

import { FsPaneComponent } from './components/pane/pane.component';
import { FsPane } from './services/pane.service';


@NgModule({
  imports: [
    CommonModule,
    ObserversModule,
    LayoutModule,
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
