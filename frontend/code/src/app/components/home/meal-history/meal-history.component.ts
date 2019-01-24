import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { MealApiService } from '../../../services/api/meal.api.service';
import { Meal } from '../../../models/meal.model';
import { SessionService } from '../../../services/session.service';
import { User } from '../../../models/user.model';
import { UserApiService } from '../../../services/api/user.api.service';
import { MealCategory } from './meal.category';
@Component({
  selector: 'app-meal-history',
  templateUrl: './meal-history.component.html',
  styleUrls: ['./meal-history.component.scss']
})
export class MealHistoryComponent implements AfterViewInit, OnInit {
  tableConfig = {
    dataSet: [],
    originalData: [],
    loading: false,
    size: 'middle',
    bordered: true,
    refreshData: async () => {
      setTimeout(async () => {
        const filterParams = {
          ...this.filterForm.helpers.getFormValue(),
          userId: this.userForm.state.form.get('userId').value || this.session.getUserId()
        };
        this.tableConfig.loading = true;
        this.tableConfig.dataSet = await this.api.getMeals(filterParams);
        this.tableConfig.originalData = [...this.tableConfig.dataSet];
        this.tableConfig.loading = false;
      }, 0);
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
        if (!this.session.isUser && !this.userForm.state.form.get('userId').value) {
          this.ns.error('User not selected', 'Please select a user first');
          throw new Error('Please select a user first');
        }
        if (this.modalForm.state.form.valid) {
          await this.api.createMeal({
            ...this.modalForm.state.form.value,
            user: { id: this.userForm.state.form.value.userId || this.session.getUserId() }
          });
          this.ns.success('Successful', 'Meal added');
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
          // not sending the user id as you are not supposed to change user id
          await this.api.updateMeal({
            ...this.modalForm.state.form.value
          });
          this.ns.success('Successful', 'Meal updated');
          this.tableConfig.refreshData();
        } else {
          throw new Error('Form Not Valid');
        }
      },
      delete: async () => {
        await this.api.deleteMealById(this.modalForm.state.form.get('id').value);
        this.ns.success('Successful', 'Meal deleted');
        this.tableConfig.refreshData();
      }
    },
    actions: {
      create: () => {
        this.modalConfig.state.nzOkText = 'Create';
      },
      read: () => {
        this.modalForm.state.form.disable({ onlySelf: true });
      },
      update: () => {
        this.modalConfig.state.nzOkText = 'Update';
      },
      delete: () => {
        this.modalConfig.state.nzOkText = 'Delete';
        this.modalConfig.state.nzOkType = 'danger';
      }
    },
    modalTitles: {
      create: 'Add meal',
      read: 'View meal',
      update: 'Edit meal',
      delete: 'Delete meal'
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
      execute: (action: string, meal?: Meal) => {
        this.modalConfig.helpers.clearState();
        this.modalConfig.state.visible = true;
        this.modalConfig.state.title = this.modalConfig.modalTitles[action];
        this.modalForm.state.form.patchValue(meal || {});
        this.modalConfig.state.calleeFn = action;
        this.modalConfig.actions[action](meal);
      }
    }
  };
  modalForm = {
    state: {
      form: null as FormGroup,
      mealCategories: [
        { name: 'BreakFast', value: MealCategory.breakfast },
        { name: 'Lunch', value: MealCategory.lunch },
        { name: 'Dinner', value: MealCategory.dinner },
        { name: 'Snack', value: MealCategory.snack }
      ]
    },
    helpers: {
      initialize: () => {
        this.modalForm.state.form = new FormGroup(
          {
            id: new FormControl(null, []),
            name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            description: new FormControl(null, [Validators.maxLength(50)]),
            calories: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(10000)]),
            mealDateTime: new FormControl(null, [Validators.required]),
            category: new FormControl(null, [Validators.required])
          },
          { updateOn: 'blur' }
        );
      },
      resetForm: () => {
        this.modalForm.state.form.enable();
        this.modalForm.state.form.reset();
      }
    }
  };

  filterForm = {
    state: {
      form: null as FormGroup,
      title: 'Apply date time filter'
    },
    handlers: {
      applyFilter: () => {
        this.tableConfig.refreshData();
      }
    },
    helpers: {
      initialize: () => {
        this.filterForm.state.form = new FormGroup(
          {
            fromDate: new FormControl(new Date(), []),
            toDate: new FormControl(null, []),
            fromTime: new FormControl(null, []),
            toTime: new FormControl(null, [])
          },
          { updateOn: 'blur' }
        );
      },
      resetForm: () => {
        this.filterForm.state.form.reset();
      },
      getFormValue: () => {
        return Object.entries(this.filterForm.state.form.value).reduce((p: Object, c: any) => {
          p[c[0]] = c[1] ? new Date(c[1]).toISOString() : null;
          return p;
        }, {});
      }
    }
  };

  userForm = {
    state: {
      form: null as FormGroup,
      title: 'Select user',
      allUsers: [] as User[]
    },
    helpers: {
      initialize: () => {
        this.userForm.state.form = new FormGroup({
          userId: new FormControl(null, [])
        });
        this.userForm.state.form.get('userId').valueChanges.subscribe(x => {
          this.tableConfig.refreshData();
        });
      },
      initializeUsers: async () => {
        this.userForm.state.allUsers = (await this.userApi.getUsers()).filter(x => x.role === 'user');
      },
      resetForm: () => {
        this.userForm.state.form.reset();
      }
    }
  };

  constructor(
    private readonly api: MealApiService,
    private readonly userApi: UserApiService,
    private readonly ns: NotificationService,
    public session: SessionService
  ) {}

  ngOnInit() {
    this.modalForm.helpers.initialize();
    this.filterForm.helpers.initialize();
    this.userForm.helpers.initialize();
  }
  ngAfterViewInit() {
    // if (!this.session.isAdmin) {
    //   this.tableConfig.refreshData();
    // }
    if (this.session.isAdmin) {
      this.userForm.helpers.initializeUsers();
    }
  }
}
