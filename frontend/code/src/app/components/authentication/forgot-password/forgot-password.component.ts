import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoginApiService } from '../../../services/api/login.api.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: LoginApiService,
    private ns: NotificationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.validateForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email])
      },
      { updateOn: 'blur' }
    );
  }

  async onSubmit() {
    Object.values(this.validateForm.controls).forEach(x => {
      x.markAsDirty();
      x.updateValueAndValidity();
    });
    if (this.validateForm.valid) {
      try {
        await this.api.forgot(this.validateForm.value);
        this.ns.success('Password Reset', 'If the email is present in our database, we have sent you an email ');
        this.router.navigate(['/login']);
      } catch (err) {}
    }
  }

  goBack() {
    this.location.back();
  }
}
