import { NgModule, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LoginDetails } from '../../models/login-details.model';
import { LoginResonse } from '../../models/login-response.model';
import { ForgotDetails } from '../../models/reset-details.model';
import { RegisterDetails } from '../../models/register-details.model';

@Injectable()
export class LoginApiService {
  constructor(private http: ApiService) {}

  public login(loginDetails: LoginDetails): Promise<LoginResonse> {
    return this.http.post('authenticate', loginDetails);
  }

  public forgot(forgotDetails: ForgotDetails): Promise<any> {
    return this.http.post('authenticate/forgot', forgotDetails);
  }

  public register(registerDetails: RegisterDetails): Promise<any> {
    return this.http.post('authenticate/register', registerDetails);
  }

  public refreshToken(): Promise<LoginResonse> {
    return this.http.get('authenticate/refresh/token');
  }

  public checkUniqueUsername(userName: string): Promise<any> {
    return this.http.get(`authenticate/check-unique/${userName}`);
  }

  public checkUniqueEmail(email: string): Promise<any> {
    return this.http.get(`authenticate/check-unique-email/${email}`);
  }
}
