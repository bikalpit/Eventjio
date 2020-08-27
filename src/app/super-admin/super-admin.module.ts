import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { MaterialModule } from '../_helpers/material.module';
import {MatTableModule} from '@angular/material/table';
import { OrdersComponent } from './orders/orders.component';
import { CustomersComponent } from './customers/customers.component';

@NgModule({
  declarations: [DashboardComponent, EventsComponent, OrdersComponent, CustomersComponent],
  imports: [
    CommonModule, SuperAdminRoutingModule, MaterialModule, MatTableModule
  ]
})
export class SuperAdminModule { }
