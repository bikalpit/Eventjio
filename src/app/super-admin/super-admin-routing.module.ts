import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent
  },
  { 
    path: 'events', 
    component: EventsComponent
  },
  { 
    path: 'orders', 
    component: OrdersComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
