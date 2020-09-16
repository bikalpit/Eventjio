import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_helpers/material.module';
import { SingleEventDashboard } from './single-event-dashboard'
import { SingleEventDashboardRoutingModule } from './single-event-dashboard-routing.module';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { WaitilistSignupComponent } from './waitilist-signup/waitilist-signup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IssuedTicketComponent } from './issued-ticket/issued-ticket.component';



@NgModule({
  declarations: [EventSummaryComponent,SingleEventDashboard, IssuedTicketComponent, WaitilistSignupComponent],
  imports: [
    CommonModule,
    SingleEventDashboardRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class SingleEventDashboardModule { }
