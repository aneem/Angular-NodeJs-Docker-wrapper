import { Component, OnInit } from '@angular/core';
import { MealApiService } from '../../../services/api/meal.api.service';
import { SessionService } from '../../../services/session.service';
import { NotificationService } from '../../../services/notification.service';
import { Meal } from '../../../models/meal.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MealCategory } from '../meal-history/meal.category';

@Component({
  selector: 'app-daily-meal',
  templateUrl: './daily-meal.component.html',
  styleUrls: ['./daily-meal.component.scss']
})
export class DailyMealComponent implements OnInit {
  tableConfig = {
    state: {
      dataSet: [] as Array<Meal>,
      loading: false,
      size: 'middle',
      bordered: false
    },
    helpers: {
      refreshData: async () => {
        setTimeout(async () => {
          const filterParams = {
            fromDate: new Date().toISOString(),
            userId: this.session.getUserId()
          };
          this.tableConfig.state.loading = true;
          this.tableConfig.state.dataSet = await this.api.getMeals(filterParams);
          this.tableConfig.state.loading = false;
        }, 0);
      },
      isCalorieWithinLimit: () => {
        return this.tableConfig.helpers.getConsumedCalories() <= this.session.getUser().noOfDailyCalories;
      },
      getConsumedCalories: () => this.tableConfig.state.dataSet.reduce((p, c) => p + c.calories, 0),
      getConsumedCaloriesPercentage: () => {
        if (this.session.getUser().noOfDailyCalories < 1) {
          return 'NA';
        } else {
          return (
            ((this.tableConfig.helpers.getConsumedCalories() / this.session.getUser().noOfDailyCalories) * 100).toFixed(
              0
            ) + '%'
          );
        }
      }
    }
  };
  // tableConfig = {
  //   state: {
  //     dataSet: [] as Array<Meal>,
  //     loading: false,
  //     loadingMore: false
  //   },
  //   helpers: {
  //     refreshData: async () => {
  //       setTimeout(async () => {
  //         const filterParams = {
  //           fromDate: new Date().toISOString(),
  //           userId: this.session.getUserId()
  //         };
  //         this.tableConfig.state.loading = true;
  //         this.tableConfig.state.dataSet = await this.api.getMeals(filterParams);
  //         this.tableConfig.state.loading = false;
  //       }, 0);
  //     },
  //     isCalorieWithinLimit: () => {
  //       return this.tableConfig.helpers.getConsumedCalories() < this.session.getUser().noOfDailyCalories;
  //     },
  //     getConsumedCalories: () => this.tableConfig.state.dataSet.reduce((p, c) => p + c.calories, 0),
  //     getConsumedCaloriesPercentage: () => {
  //       if (this.session.getUser().noOfDailyCalories < 1) {
  //         return 'NA';
  //       } else {
  //         return (
  //           (this.tableConfig.helpers.getConsumedCalories() / this.session.getUser().noOfDailyCalories) *
  //           100
  //         ).toFixed(2);
  //       }
  //     }
  //   }
  // };

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
          await this.api.createMeal({
            ...this.modalForm.state.form.value,
            user: { id: this.session.getUserId() }
          });
          this.ns.success('Successful', 'Meal added');
          this.tableConfig.helpers.refreshData();
        } else {
          throw new Error('Form Not Valid');
        }
      },
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
          this.tableConfig.helpers.refreshData();
        } else {
          throw new Error('Form Not Valid');
        }
      },
      delete: async () => {
        await this.api.deleteMealById(this.modalForm.state.form.get('id').value);
        this.ns.success('Successful', 'Meal deleted');
        this.tableConfig.helpers.refreshData();
      }
    },
    actions: {
      create: () => {
        this.modalConfig.state.nzOkText = 'Create';
      },
      update: (meal: Meal) => {
        this.modalForm.state.form.patchValue({ mealDateTime: new Date(meal.mealDateTime) });
        this.modalConfig.state.nzOkText = 'Update';
      },
      delete: () => {
        this.modalConfig.state.nzOkText = 'Delete';
        this.modalConfig.state.nzOkType = 'danger';
      }
    },
    modalTitles: {
      create: 'Add meal',
      update: 'Edit meal',
      delete: 'Delete meal'
    },
    state: {
      visible: false,
      title: 'Title',
      calleeFn: 'noOp',
      nzMaskClosable: true,
      isOkLoading: false,
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
      ],
      mealColors: {
        breakfast: '#1890FF',
        lunch: '#FAAD14',
        dinner: '#4C212A',
        snack: '#00635D'
      }
    },
    helpers: {
      initialize: () => {
        this.modalForm.state.form = new FormGroup(
          {
            id: new FormControl(null, []),
            name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            description: new FormControl(null, [Validators.maxLength(500)]),
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

  constructor(
    private readonly api: MealApiService,
    public readonly session: SessionService,
    private ns: NotificationService
  ) {}

  ngOnInit() {
    this.tableConfig.helpers.refreshData();
    this.modalForm.helpers.initialize();
  }
}
