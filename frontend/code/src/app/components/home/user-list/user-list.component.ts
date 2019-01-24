import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserApiService } from '../../../services/api/user.api.service';
import { NotificationService } from '../../../services/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { timer, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { LoginApiService } from '../../../services/api/login.api.service';
import { ForgotDetails } from '../../../models/reset-details.model';
import { Roles } from './roles';
import { SessionService } from '../../../services/session.service';
import { invalidUserNameCharCheck } from '../../common/validators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit {
  tableConfig = {
    dataSet: [],
    originalData: [],
    loading: true,
    size: 'middle',
    bordered: true,
    refreshData: async () => {
      this.tableConfig.loading = true;
      this.tableConfig.dataSet = await this.api.getUsers();
      this.tableConfig.originalData = [...this.tableConfig.dataSet];
      this.tableConfig.loading = false;
    },
    onSortChange: (sort: { key: string; value: string }) => {
      if (sort.key && sort.value) {
        this.tableConfig.dataSet = this.tableConfig.originalData.sort((a, b) =>
          sort.value === 'ascend' ? (a[sort.key] > b[sort.key] ? 1 : -1) : b[sort.key] > a[sort.key] ? 1 : -1
        );
      } else {
        this.tableConfig.dataSet = [...this.tableConfig.originalData];
      }
    }
  };
  modalConfig = {
    handlers: {
      create: async () => {
        Object.values(this.modalForm.state.form.controls).forEach(x => {
          x.markAsDirty();
          if (!x.asyncValidator) {
            x.updateValueAndValidity();
          }
        });

        if (this.modalForm.state.form.valid) {
          await this.api.createUser(this.modalForm.state.form.value);
          this.ns.success('Successful', 'User created');
          this.tableConfig.refreshData();
        } else {
          throw new Error('Form Not Valid');
        }
      },
      read: async () => {},
      update: async () => {
        Object.values(this.modalForm.state.form.controls).forEach(x => {
          x.markAsDirty();
          if (!x.asyncValidator) {
            x.updateValueAndValidity();
          }
        });
        if (this.modalForm.state.form.valid) {
          // disabled form control doesnt show up in value, so manually adding it
          await this.api.updateUser({
            ...this.modalForm.state.form.value,
            userName: this.modalForm.state.form.get('userName').value,
            email: this.modalForm.state.form.get('email').value
          });
          this.ns.success('Successful', 'User updated');
          this.tableConfig.refreshData();
        } else {
          throw new Error('Form Not Valid');
        }
      },
      delete: async () => {
        await this.api.deleteUserById(this.modalForm.state.form.get('id').value);
        this.ns.success('Successful', 'User deleted');
        this.tableConfig.refreshData();
      },
      resetPassword: async () => {
        await this.loginApi.forgot({ email: this.modalForm.state.form.get('email').value } as ForgotDetails);
        this.ns.success('Successful', 'Password reset successful');
      }
    },
    actions: {
      create: () => {
        this.modalForm.state.form.addControl(
          'password',
          new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)])
        );
        this.modalConfig.state.nzOkText = 'Create';
      },
      read: () => {
        this.modalForm.state.form.disable({ onlySelf: true });
      },
      update: () => {
        this.modalForm.state.form.get('userName').disable({ onlySelf: true });
        this.modalForm.state.form.get('email').disable({ onlySelf: true });
        this.modalConfig.state.nzOkText = 'Update';
      },
      delete: () => {
        this.modalConfig.state.nzOkText = 'Delete';
        this.modalConfig.state.nzOkType = 'danger';
      },
      resetPassword: () => {
        this.modalConfig.state.nzOkText = 'Reset';
        this.modalConfig.state.nzOkType = 'danger';
      }
    },
    modalTitles: {
      create: 'Add user',
      read: 'View user',
      update: 'Edit user',
      delete: 'Delete user',
      resetPassword: 'Reset Password'
    },
    state: {
      visible: false,
      title: 'Title',
      calleeFn: 'noOp',
      isOkLoading: false,
      nzMaskClosable: true,
      nzOkText: 'Ok',
      nzOkType: 'primary'
    },
    events: {
      cancel: () => {
        this.modalConfig.state.visible = false;
      },
      ok: async () => {
        try {
          this.modalConfig.state.isOkLoading = true;
          await this.modalConfig.handlers[this.modalConfig.state.calleeFn]();
          this.modalConfig.state.isOkLoading = false;
          this.modalConfig.state.visible = false;
        } catch (err) {
          this.modalConfig.state.isOkLoading = false;
        }
      }
    },
    helpers: {
      clearState: () => {
        this.modalConfig.state.visible = false;
        this.modalConfig.state.title = 'Title';
        this.modalConfig.state.calleeFn = 'noOp';
        this.modalConfig.state.isOkLoading = false;
        this.modalConfig.state.nzOkText = 'Ok';
        this.modalConfig.state.nzOkType = 'primary';
        this.modalForm.helpers.resetForm();
      },
      execute: (action: string, user?: User) => {
        this.modalConfig.helpers.clearState();
        this.modalConfig.state.visible = true;
        this.modalConfig.state.title = this.modalConfig.modalTitles[action];
        this.modalForm.state.form.patchValue(user || {});
        this.modalConfig.state.calleeFn = action;
        this.modalConfig.actions[action](user);
      }
    }
  };
  modalForm = {
    state: {
      form: null as FormGroup,
      roles: [
        { name: 'Admin', value: Roles.admin },
        { name: 'User Manager', value: Roles.userManager },
        { name: 'User', value: Roles.user }
      ]
    },
    helpers: {
      initialize: () => {
        this.modalForm.state.form = new FormGroup(
          {
            id: new FormControl(null, []),
            firstName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            middleName: new FormControl(null, [Validators.maxLength(50)]),
            lastName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            userName: new FormControl(
              null,
              [Validators.required, invalidUserNameCharCheck(), Validators.maxLength(50)],
              [this.modalForm.helpers.uniqueCheckUsername]
            ),
            email: new FormControl(
              null,
              [Validators.required, Validators.email, Validators.maxLength(50)],
              [this.modalForm.helpers.uniqueCheckEmail]
            ),
            role: new FormControl(null, [Validators.required])
          },
          { updateOn: 'blur' }
        );
      },
      uniqueCheckUsername: (control: FormControl) => {
        return timer(500).pipe(
          switchMap(() => {
            return from(this.loginApi.checkUniqueUsername(control.value)).pipe(
              map(x => {
                if (!x['result']) {
                  return { duplicated: true };
                }
              })
            );
          })
        );
      },
      uniqueCheckEmail: (control: FormControl) => {
        return timer(500).pipe(
          switchMap(() => {
            return from(this.loginApi.checkUniqueEmail(control.value)).pipe(
              map(x => {
                if (!x['result']) {
                  return { duplicated: true };
                }
              })
            );
          })
        );
      },
      resetForm: () => {
        this.modalForm.state.form.removeControl('password');
        this.modalForm.state.form.enable();
        this.modalForm.state.form.reset();
      }
    }
  };
  constructor(
    private readonly api: UserApiService,
    private readonly loginApi: LoginApiService,
    private readonly ns: NotificationService,
    private session: SessionService
  ) {}

  ngAfterViewInit() {
    this.tableConfig.refreshData();
    this.modalForm.helpers.initialize();
  }
}
