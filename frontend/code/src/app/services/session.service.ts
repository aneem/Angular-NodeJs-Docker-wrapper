import { Injectable, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';
import { User } from '../models/user.model';
import { Roles } from '../components/home/user-list/roles';
import { TitleCasePipe } from '@angular/common';

@Injectable()
export class SessionService {
  constructor(private jwtHelper: JwtHelperService, private storage: StorageService) {}

  public logout() {
    this.storage.removeUserToken();
  }

  public login(token: string) {
    this.storage.setUserToken(token);
  }
  public getUser(): User {
    try {
      const user = this.jwtHelper.decodeToken(this.storage.getUserToken());
      delete user['iat'];
      delete user['exp'];
      return <User>user;
    } catch (err) {
      return <User>{};
    }
  }

  public getUserId(): number {
    return this.getUser().id;
  }

  public getUserName(): string {
    return this.getUser().userName;
  }
  public getUserFullName(): string {
    const user = this.getUser();
    const titleCasePipe = new TitleCasePipe();
    return titleCasePipe.transform(
      user.firstName + (user.middleName ? ' ' + user.middleName + ' ' : ' ') + user.lastName
    );
  }

  public getAccessToken(): string {
    return this.storage.getUserToken();
  }

  public isTokenExpired() {
    try {
      if (this.getAccessToken()) {
        return this.jwtHelper.isTokenExpired(this.getAccessToken());
      }
    } catch (err) {
      return false;
    }
  }

  public isAuthenticated(): boolean {
    try {
      return this.getAccessToken() ? !this.jwtHelper.isTokenExpired(this.getAccessToken()) : false;
    } catch (err) {
      return false;
    }
  }

  public isAuthorized(requiredRoles: string[]): boolean {
    const user = this.getUser();
    const hasRole = () => requiredRoles.includes(user.role);
    return this.isAuthenticated() && user.role && hasRole();
  }

  get isAdmin() {
    return this.getUser().role == Roles.admin;
  }

  get isUserManager() {
    return this.getUser().role == Roles.userManager;
  }

  get isUser() {
    return this.getUser().role == Roles.user;
  }

  isUserProfileComplete() {
    return this.isNotEmpty(this.getUser().contactNumber) && this.isNotEmpty(this.getUser().address);
  }

  private isNotEmpty(x: any) {
    if (typeof x === 'string') {
      return x != null && x !== undefined && x !== '';
    } else if (typeof x === 'number') {
      return x != null && x !== undefined;
    }
  }
}
