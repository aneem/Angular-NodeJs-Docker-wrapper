import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { timer, of, from } from 'rxjs';
import { switchMap, mapTo, map } from 'rxjs/operators';
import { LoginApiService } from '../../../services/api/login.api.service';
import { NotificationService } from '../../../services/notification.service';
import { invalidUserNameCharCheck } from '../../common/validators';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private router: Router,
    private api: LoginApiService,
    private ns: NotificationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.validateForm = new FormGroup(
      {
        firstName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        middleName: new FormControl(null, [Validators.maxLength(50)]),
        lastName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        userName: new FormControl(
          null,
          [Validators.required, invalidUserNameCharCheck(), Validators.maxLength(50)],
          [this.checkUniqueUsername]
        ),
        password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
        email: new FormControl(
          null,
          [Validators.required, Validators.email, Validators.maxLength(50)],
          [this.uniqueCheckEmail]
        )
      },
      {
        updateOn: 'blur'
      }
    );
  }

  async onSubmit() {
    Object.values(this.validateForm.controls).forEach(x => {
      x.markAsDirty();
      if (!x.asyncValidator) {
        x.updateValueAndValidity();
      }
    });
    if (this.validateForm.valid) {
      try {
        await this.api.register(this.validateForm.value);
        this.ns.success('Registration Successful', 'User Created Successfullly');
        this.router.navigate(['/login']);
      } catch (err) {
        this.ns.error('Registration Failure', 'Error during user creation');
      }
    }
  }

  goBack() {
    this.location.back();
  }

  checkUniqueUsername = (control: FormControl) => {
    return timer(500).pipe(
      switchMap(() => {
        return from(this.api.checkUniqueUsername(control.value)).pipe(
          map(x => {
            if (!x['result']) {
              return { duplicated: true };
            }
          })
        );
      })
    );
  };

  uniqueCheckEmail = (control: FormControl) => {
    return timer(500).pipe(
      switchMap(() => {
        return from(this.api.checkUniqueEmail(control.value)).pipe(
          map(x => {
            if (!x['result']) {
              return { duplicated: true };
            }
          })
        );
      })
    );
  };
}
