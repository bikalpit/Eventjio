import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { OrdersComponent } from './orders/orders.component';
import { CouponsComponent } from './coupons/coupons.component';

import { CustomersComponent } from './customers/customers.component';
import { MyBoxofficeComponent } from './my-boxoffice/my-boxoffice.component';


const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent
  },
  { 
    path: 'events', 
    component: EventsComponent
  },
  { 
    path: 'orders', 
    component: OrdersComponent
  },
  { 
    path: 'coupons', 
    component: CouponsComponent
  },
  { 
    path: '', 
    component: MyBoxofficeComponent
  },
  { 
    path: 'boxoffice', 
    component: MyBoxofficeComponent
  },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
 { 
    path: 'customers', 
    component: CustomersComponent
  },
  { path: 'single-eventDashboard', loadChildren: () => import('./single-event-dashboard/single-event-dashboard.module').then(m => m.SingleEventDashboardModule) },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
