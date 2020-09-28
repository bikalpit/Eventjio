import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { MaterialModule } from '../_helpers/material.module';
import { MatTableModule } from '@angular/material/table';
import { OrdersComponent } from './orders/orders.component';
import { CouponsComponent } from './coupons/coupons.component';
import { CustomersComponent } from './customers/customers.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { CKEditorModule } from 'ngx-ckeditor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddNewTicketType } from './events/events.component';
import { AddNewTicketGroup } from './events/events.component';
import { myCreateDiscountCodeDialog } from './coupons/coupons.component';
import { myBatchVoucherCodeDialog } from './coupons/coupons.component';
import { AssignToEventDialog } from './coupons/coupons.component';
import { AssignToTicketTypeDialog } from './coupons/coupons.component';
import { ExportOrderDialog } from './orders/orders.component';
import { AddNewOrderDialog } from './orders/orders.component';
import { BookTicketDialog } from './orders/orders.component';
import { OrderInvoiceDialog } from './orders/orders.component';
import { MyBoxofficeComponent } from './my-boxoffice/my-boxoffice.component';
import { myCreateNewBoxofficeDialog } from './my-boxoffice/my-boxoffice.component';
import { DialogEventImageUpload } from './events/events.component'
import { MatTimepickerModule } from 'mat-timepicker';





@NgModule({
  declarations: [
      DashboardComponent, 
      EventsComponent,
      CouponsComponent,
      OrdersComponent, 
      CustomersComponent,
      MyBoxofficeComponent,
      myCreateDiscountCodeDialog,
      myBatchVoucherCodeDialog,
      ExportOrderDialog,
      AddNewOrderDialog,
      BookTicketDialog,
      AddNewTicketType,
      AddNewTicketGroup,
      OrderInvoiceDialog,
      myCreateNewBoxofficeDialog,
      DialogEventImageUpload,
      AssignToEventDialog,
      AssignToTicketTypeDialog
  ],
  
  imports: [
    CommonModule, 
    SuperAdminRoutingModule, 
    MaterialModule, 
    MatTableModule,
    FlexLayoutModule,
    FontAwesomeModule,
    MatTooltipModule,
    HttpClientModule,
    MatCardModule,
    MatExpansionModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MatTimepickerModule,
  ],
  
  entryComponents: [myCreateDiscountCodeDialog,myBatchVoucherCodeDialog,ExportOrderDialog,AddNewOrderDialog,BookTicketDialog,
    OrderInvoiceDialog,AddNewTicketType,AddNewTicketGroup,myCreateNewBoxofficeDialog,DialogEventImageUpload,AssignToEventDialog,AssignToTicketTypeDialog],
})
  
export class SuperAdminModule {}
