import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Environment } from 'src/environments/environment.model';
import { Observable } from 'rxjs';

export interface HttpOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}
@Injectable()
export class ApiService {
  constructor(@Inject('environment') private environment: Environment, private http: HttpClient) {}

  getO<T>(
    url: string,
    options?: HttpOptions
  ): Observable<any> {
    return this.http.get<T>(this.environment.api + url, options);
  }

  postO(
    url: string,
    body: any | null,
    options?: HttpOptions
  ): Observable<any> {
    return this.http.post(this.environment.api + url, body, options);
  }

  putO(
    url: string,
    body: any | null,
    options?: HttpOptions
  ): Observable<any> {
    return this.http.put(this.environment.api + url, body, options);
  }

  deleteO(
    url: string,
    body?: any | null,
    options?: HttpOptions
  ): Observable<any> {
    return this.http.delete(this.environment.api + url, options);
  }

  get<T>(
    url: string,
    options?: HttpOptions
  ): Promise<any> {
    return this.http.get<T>(this.environment.api + url, options).toPromise();
  }

  post(
    url: string,
    body: any | null,
    options?: HttpOptions
  ): Promise<any> {
    return this.http.post(this.environment.api + url, body, options).toPromise();
  }

  put(
    url: string,
    body: any | null,
    options?: HttpOptions
  ): Promise<any> {
    return this.http.put(this.environment.api + url, body, options).toPromise();
  }

  delete(
    url: string,
    body?: any | null,
    options?: HttpOptions
  ): Promise<any> {
    return this.http.delete(this.environment.api + url, options).toPromise();
  }


}
