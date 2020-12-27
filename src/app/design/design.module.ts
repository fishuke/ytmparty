import {NgModule} from '@angular/core';
import {LayoutComponent} from './layout/layout.component';
import {HeaderComponent} from './header/header.component';
import {SharedModule} from '@shared/shared.module';

@NgModule({
  declarations: [
    LayoutComponent,

    HeaderComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [],
  providers: []
})
export class DesignModule {
}
