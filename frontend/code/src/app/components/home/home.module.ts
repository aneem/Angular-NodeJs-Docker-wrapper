import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../common/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { MealHistoryComponent } from './meal-history/meal-history.component';
import { UserListComponent } from './user-list/user-list.component';
import { DailyMealComponent } from './daily-meal/daily-meal.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    UserComponent,
    MealHistoryComponent,
    UserListComponent,
    DailyMealComponent
  ],
  imports: [SharedModule, HomeRoutingModule],
  providers: []
})
export class HomeModule {}
