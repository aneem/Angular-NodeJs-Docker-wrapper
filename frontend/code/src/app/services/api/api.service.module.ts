import { NgModule } from '@angular/core';
import { UserApiService } from './user.api.service';
import { LoginApiService } from './login.api.service';
import { MealApiService } from './meal.api.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [UserApiService, LoginApiService, MealApiService]
})
export class ApiServiceModule {}
