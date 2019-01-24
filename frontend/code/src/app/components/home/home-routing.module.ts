import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home.component';
import { UserComponent } from './user/user.component';
import { MealHistoryComponent } from './meal-history/meal-history.component';
import { UserListComponent } from './user-list/user-list.component';
import { RouteGuardService } from '../../services/routeguard.service';
import { RoleGuardService } from '../../services/roleguard.service';
import { RoleGroups } from './user-list/roles';
import { DailyMealComponent } from './daily-meal/daily-meal.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: DashboardComponent, data: { role: RoleGroups.all } },
      { path: 'user', component: UserComponent, data: { role: RoleGroups.all } },
      { path: 'user-list', component: UserListComponent, data: { role: RoleGroups.adminAnduserManager } },
      { path: 'meal-history', component: MealHistoryComponent, data: { role: RoleGroups.all } },
      // { path: 'meal', component: DailyMealComponent, data: { role: RoleGroups.all } }
    ],
    canActivateChild: [RouteGuardService, RoleGuardService],
  }
];

export const HomeRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
