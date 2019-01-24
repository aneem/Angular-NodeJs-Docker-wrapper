import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Environment } from 'src/environments/environment.model';
import { SessionService } from './session.service';
import { NotificationService } from './notification.service';

@Injectable()
export class RoleGuardService implements CanActivate, CanActivateChild {
  constructor(
    @Inject('environment') private environment: Environment,
    private session: SessionService,
    private router: Router,
    private ns: NotificationService
  ) {}
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check if the environment says to skip authorization checks,
    if (this.environment.skipAuthorizationChecks) {
      return true;
    }
    if (route.data.role.includes(this.session.getUser().role)) {
      return true;
    } else {
      this.ns.warn('Unauthorized route', 'Please talk to administrator');
      return false;
    }
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}
