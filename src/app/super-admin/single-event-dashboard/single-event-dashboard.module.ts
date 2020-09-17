import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_helpers/material.module';
import { SingleEventDashboard } from './single-event-dashboard'
import { SingleEventDashboardRoutingModule } from './single-event-dashboard-routing.module';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { WaitilistSignupComponent } from './waitilist-signup/waitilist-signup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { IssuedTicketComponent } from './issued-ticket/issued-ticket.component';
import { CKEditorModule } from 'ngx-ckeditor';



@NgModule({
  declarations: [EventSummaryComponent,SingleEventDashboard, IssuedTicketComponent, WaitilistSignupComponent, OrderConfirmationComponent],
  imports: [
    CommonModule,
    SingleEventDashboardRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    CKEditorModule
  ]
})
export class SingleEventDashboardModule { }
