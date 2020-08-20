import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';

const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent
  },
  { 
    path: 'my-subscriptions', 
    component: MySubscriptionsComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
