import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleEventDashboard } from './single-event-dashboard'
import { SingleEventDashboardRoutingModule } from './single-event-dashboard-routing.module';
import { EventSummaryComponent } from './event-summary/event-summary.component';


@NgModule({
  declarations: [EventSummaryComponent,SingleEventDashboard],
  imports: [
    CommonModule,
    SingleEventDashboardRoutingModule
  ]
})
export class SingleEventDashboardModule { }
