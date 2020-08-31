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
import {MatTooltipModule} from '@angular/material/tooltip';
// import { MdePopoverModule } from '@material-extended/mde';

import { myCreateDiscountCodeDialog} from './coupons/coupons.component';
import { myBatchVoucherCodeDialog} from './coupons/coupons.component';



@NgModule({
  declarations: [DashboardComponent, EventsComponent,CouponsComponent, OrdersComponent, CustomersComponent,myCreateDiscountCodeDialog,myBatchVoucherCodeDialog,],
  imports: [
    CommonModule, SuperAdminRoutingModule, MaterialModule, MatTableModule,
    FlexLayoutModule,FontAwesomeModule,MatTooltipModule,HttpClientModule,
  ],
  entryComponents: [myCreateDiscountCodeDialog,myBatchVoucherCodeDialog],
})
  
export class SuperAdminModule {}
