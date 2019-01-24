import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserApiService } from '../../../services/api/user.api.service';
import { NotificationService } from '../../../services/notification.service';
import { SessionService } from '../../../services/session.service';
import { LoginApiService } from '../../../services/api/login.api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  form: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private readonly api: UserApiService,
    private readonly loginApi: LoginApiService,
    private readonly ns: NotificationService,
    public readonly session: SessionService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        id: new FormControl(null, []),
        firstName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        middleName: new FormControl(null, [Validators.maxLength(50)]),
        lastName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        userName: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.maxLength(50)]),
        email: new FormControl({ value: null, disabled: true }, [
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]),
        contactNumber: new FormControl(null, [, Validators.maxLength(50)]),
        address: new FormControl(null, [, Validators.maxLength(250)]),
        noOfDailyCalories: new FormControl(null, [Validators.min(0), Validators.max(10000)])
      },
      { updateOn: 'blur' }
    );
    this.form.patchValue(this.session.getUser());

    this.passwordForm = new FormGroup(
      {
        userId: new FormControl(null, []),
        userName: new FormControl(null, []),
        currentPassword: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        newPassword: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)])
      },
      { updateOn: 'blur' }
    );
    this.passwordForm.patchValue({ userId: this.session.getUser().id, userName: this.session.getUser().userName });
  }

  async updateProfile() {
    Object.values(this.form.controls).forEach(x => {
      x.markAsDirty();
      if (!x.asyncValidator) {
        x.updateValueAndValidity();
      }
    });
    if (this.form.valid) {
      try {
        const x = await this.api.updateUser(this.form.value);
        // need to update the user in the token so we generate another token in its place
        const newToken = await this.loginApi.refreshToken();
        this.session.login(newToken.token);
        this.ns.success('Update Successful', 'Profile Updated Successfullly');
      } catch (err) {
        this.ns.error('Update Failure', 'Error during user profile update');
      }
    }
  }

  async updatePassword() {
    Object.values(this.passwordForm.controls).forEach(x => {
      x.markAsDirty();
      if (!x.asyncValidator) {
        x.updateValueAndValidity();
      }
    });
    if (this.passwordForm.valid) {
      try {
        const x = await this.api.updatePassword(this.passwordForm.value);
        this.ns.success('Update Successful', 'Password Updated Successfully');
      } catch (err) {
        this.ns.error('Update Failure', err.error.message);
      }
    }
  }
}
