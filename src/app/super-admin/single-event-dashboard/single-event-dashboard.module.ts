import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_helpers/material.module';
import { SingleEventDashboard } from './single-event-dashboard'
import { SingleEventDashboardRoutingModule } from './single-event-dashboard-routing.module';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { WaitilistSignupComponent } from './waitilist-signup/waitilist-signup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { ChartsModule } from 'ng2-charts';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { IssuedTicketComponent } from './issued-ticket/issued-ticket.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { mySendBroadcastDialog } from './broadcast/broadcast.component';
import { DuplicateComponent } from './duplicate/duplicate.component';



@NgModule({
  declarations: [EventSummaryComponent,SingleEventDashboard, IssuedTicketComponent, WaitilistSignupComponent, OrderConfirmationComponent, BroadcastComponent,  mySendBroadcastDialog, DuplicateComponent],
  imports: [
    CommonModule,
    SingleEventDashboardRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    CKEditorModule
  ],
  entryComponents: [mySendBroadcastDialog],
})
export class SingleEventDashboardModule { }
