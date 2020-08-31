import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { MaterialModule } from '../_helpers/material.module';
import {MatTableModule} from '@angular/material/table';
import { OrdersComponent } from './orders/orders.component';
import { CouponsComponent } from './coupons/coupons.component';
import { CustomersComponent } from './customers/customers.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { myCreateDiscountCodeDialog} from './coupons/coupons.component';



@NgModule({
  declarations: [DashboardComponent, EventsComponent, OrdersComponent,CouponsComponent, CustomersComponent,myCreateDiscountCodeDialog],
  imports: [
    CommonModule, SuperAdminRoutingModule, MaterialModule, MatTableModule,
    FlexLayoutModule,FontAwesomeModule,HttpClientModule,
  ],
  entryComponents: [myCreateDiscountCodeDialog],
})
  
export class SuperAdminModule {}
