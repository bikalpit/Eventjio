import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';


@NgModule({
  declarations: [DashboardComponent, MySubscriptionsComponent],
  imports: [
    CommonModule,
  ]
})
export class SuperAdminModule { }
