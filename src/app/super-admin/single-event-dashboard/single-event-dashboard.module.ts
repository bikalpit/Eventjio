import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_helpers/material.module';
import { SingleEventDashboard } from './single-event-dashboard'
import { SingleEventDashboardRoutingModule } from './single-event-dashboard-routing.module';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { EventAndTicketTypesComponent } from './event-and-ticket-types/event-and-ticket-types.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { DeleteComponent } from './delete/delete.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CKEditorModule } from 'ngx-ckeditor';


@NgModule({
  declarations: [EventSummaryComponent,SingleEventDashboard, EventAndTicketTypesComponent, CheckoutFormComponent, DeleteComponent],
  imports: [
    CommonModule,
    SingleEventDashboardRoutingModule,
    MaterialModule,MatTooltipModule,CKEditorModule
  ]
})
export class SingleEventDashboardModule { }
