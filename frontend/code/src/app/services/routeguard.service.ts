import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Environment } from 'src/environments/environment.model';
import { SessionService } from './session.service';
import { NotificationService } from './notification.service';

@Injectable()
export class RouteGuardService implements CanActivate, CanActivateChild {
  constructor(
    @Inject('environment') private environment: Environment,
    private session: SessionService,
    private router: Router,
    private ns: NotificationService
  ) {}
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check if the environment says to skip authentication checks,
    if (this.environment.skipAuthenticationChecks) {
      return true;
    }

    if (!this.session.isAuthenticated()) {
      this.session.logout();
      this.ns.warn('Session Expired', 'Please Login again');
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}
