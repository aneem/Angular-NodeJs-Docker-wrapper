import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, PreloadStrategy } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { environment } from 'src/environments/environment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { RouteGuardService } from './services/routeguard.service';
import { TokenInterceptor } from './services/interceptor.service';
import { SessionService } from './services/session.service';
import { ApiService } from './services/api/api.service';
import { LoginApiService } from './services/api/login.api.service';
import { StorageService } from './services/storage.service';
import { NotificationService } from './services/notification.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { SharedModule } from './components/common/shared.module';
import { ApiServiceModule } from './services/api/api.service.module';
import { RoleGuardService } from './services/roleguard.service';

// import * as Raven from 'raven-js';

registerLocaleData(en);

// configuration providers
const PROVIDE_ENVIRONMENT = 'environment';

// Raven.setUserContext(getUserDetails());
// Raven.config(environment.sentryDetails.url, {
//   environment: environment.environmentName,
//   captureUnhandledRejections: true
// }).install();

export function tokenGetter() {
  return localStorage.getItem('__tkn__');
}

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, ForgotPasswordComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['example.com'],
        blacklistedRoutes: ['example.com/examplebadroute/']
      }
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    ApiServiceModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    PreloadStrategy,
    // { provide: ErrorHandler, useClass: RavenErrorHandler },
    { provide: PROVIDE_ENVIRONMENT, useValue: environment },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    RouteGuardService,
    RoleGuardService,
    SessionService,
    ApiService,
    LoginApiService,
    StorageService,
    NotificationService,
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
