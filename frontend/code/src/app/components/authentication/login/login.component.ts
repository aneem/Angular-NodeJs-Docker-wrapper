import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { LoginApiService } from '../../../services/api/login.api.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private router: Router,
    private session: SessionService,
    private api: LoginApiService,
    private ns: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.session.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    this.validateForm = new FormGroup(
      {
        userName: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required])
      },
      // dont set to blur. if set to blur, the enter button will raise issue due to cursor still in the formControl
      { updateOn: 'change' }
    );
  }

  forgotPassword() {
    this.router.navigate(['/forgot']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  async onSubmit() {
    Object.values(this.validateForm.controls).forEach(x => {
      x.markAsDirty();
      x.updateValueAndValidity();
    });
    if (this.validateForm.valid) {
      try {
        const x = await this.api.login(this.validateForm.value);
        this.session.login(x.token);
        if (this.session.isUser && this.session.getUser().noOfDailyCalories < 1) {
          this.ns.warn('Profile Incomplete', 'Please complete your profile to set expected daily calories limit');
        }
        this.router.navigate(['/home']);
      } catch (err) {
        this.ns.error('Login Failure', 'Please recheck your credentials');
      }
    }
  }
}
