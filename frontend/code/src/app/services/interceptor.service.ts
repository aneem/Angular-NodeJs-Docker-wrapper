import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { SessionService } from './session.service';
import { NotificationService } from './notification.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private session: SessionService, private ns: NotificationService, private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.session.getAccessToken()
      }
    });
    if (this.session.isTokenExpired()) {
      this.ns.warn('Session Expired', 'Please login again');
      this.session.logout();
      this.router.navigate(['/']);
      return;
    }
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // TODO: parse response to return data object if the backend always sends
            // the data in { message:string, success:boolean, data:Object} format
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.ns.warn('Unauthorized', 'Restricted Content.');
            } else if (err.status === 403) {
              this.ns.warn('Forbidden', 'Restricted Content.');
            }
            //  else if (err.status === 500) {
            //   this.ns.warn('Internal Server Error', 'Error in the server. Please try again later');
            // }
          }
        }
      )
    );
  }
}
