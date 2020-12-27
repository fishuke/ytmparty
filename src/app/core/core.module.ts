import {NgModule, Optional, SkipSelf} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpTokenInterceptor} from '@core/interceptors/http.token.interceptor';
import {ApiService} from '@core/services/api.service';
import {AuthService} from '@core/services/auth.service';
import {BreakpointService} from '@core/services/breakpoint.service';
import {TokenService} from '@core/services/token.service';
import {SnackbarService} from '@core/services/snackbar.service';
import {HttpErrorInterceptor} from '@core/interceptors/http.error.interceptor';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    ApiService,
    AuthService,
    BreakpointService,
    TokenService,
    SnackbarService,
  ]
})

export class CoreModule {

  constructor(@Optional() @SkipSelf() coreModule: CoreModule) {

    if (coreModule) {
      throw new Error('You should import core module only in the root module');
    }
  }

}
