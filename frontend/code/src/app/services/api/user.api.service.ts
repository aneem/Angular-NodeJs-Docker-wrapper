import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../../models/user.model';
import { mapTo } from 'rxjs/operators';
import { UpdatePasswordDetails } from '../../models/update-password.model';

@Injectable()
export class UserApiService {
  constructor(private http: ApiService) {}

  public getUser(id: number): Promise<User> {
    return this.http.get(`user/${id}`);
  }

  public getUsers(): Promise<User[]> {
    return this.http.get('user');
  }

  public createUser(user: User): Promise<any> {
    return this.http.post('user', user);
  }

  public updateUser(user: User): Promise<any> {
    return this.http.put('user', user);
  }

  public deleteUserById(id: number): Promise<any> {
    return this.http.delete(`user/${id}`, {});
  }

  public deleteUserByUsername(userName: string): Promise<any> {
    return this.http.delete(`user/username/${userName}`, {});
  }

  public updatePassword(updatePasswordDetails: UpdatePasswordDetails): Promise<any> {
    return this.http.put(`user/change-password`, updatePasswordDetails);
  }
}
