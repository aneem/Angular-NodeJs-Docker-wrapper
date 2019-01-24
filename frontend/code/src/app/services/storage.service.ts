import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  private set(key: string, value: string, override: Boolean = false) {
    if (override) {
      localStorage.setItem(key, value);
    } else {
      if (localStorage.getItem(key) == null) {
        localStorage.setItem(key, value);
      }
    }
  }

  private get(key: string) {
    return localStorage.getItem(key);
  }

  private remove(key: string) {
    localStorage.removeItem(key);
  }

  public setUserToken(token: string) {
    this.removeUserToken();
    this.set('__tkn__', token, true);
  }

  public getUserToken(): string {
    return this.get('__tkn__');
  }

  public removeUserToken() {
    this.remove('__tkn__');
  }
}
