import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from '@core/core.module';
import { DesignModule } from '@design/design.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    CoreModule,
    DesignModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
