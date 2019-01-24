import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { mapTo } from 'rxjs/operators';
import { UpdatePasswordDetails } from '../../models/update-password.model';
import { Meal } from '../../models/meal.model';

@Injectable()
export class MealApiService {
  constructor(private http: ApiService) {}

  public getMeal(id: number): Promise<Meal> {
    return this.http.get(`meal/${id}`);
  }

  public getMeals(filterParams = {}): Promise<Meal[]> {
    return this.http.get(
      `meal?${Object.keys(filterParams)
        .filter(x => filterParams[x] != undefined)
        .reduce((p, c) => `${p}&${c}=${filterParams[c]}`, '')}`
    );
  }

  public createMeal(meal: Meal): Promise<any> {
    return this.http.post('meal', meal);
  }

  public updateMeal(meal: Meal): Promise<any> {
    return this.http.put('meal', meal);
  }

  public deleteMealById(id: number): Promise<any> {
    return this.http.delete(`meal/${id}`, {});
  }

  public deleteMealByMealname(mealName: string): Promise<any> {
    return this.http.delete(`meal/mealname/${mealName}`, {});
  }
}
