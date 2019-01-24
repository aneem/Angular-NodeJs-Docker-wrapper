import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { RouteGuardService } from './services/routeguard.service';
import { RoleGuardService } from './services/roleguard.service';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot', component: ForgotPasswordComponent },
      {
        path: 'home',
        loadChildren: './components/home/home.module#HomeModule',
        data: { preload: true }
      },
      { path: '**', redirectTo: '/login' }
    ]
  }
];

export class PreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    return route.data && route.data.preload ? load() : of(null);
  }
}
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadStrategy
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
