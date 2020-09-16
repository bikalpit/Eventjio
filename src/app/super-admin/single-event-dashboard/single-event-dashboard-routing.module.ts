import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleEventDashboard } from './single-event-dashboard';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { EventAndTicketTypesComponent } from './event-and-ticket-types/event-and-ticket-types.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { DeleteComponent } from './delete/delete.component';

const routes: Routes = [
  { 
    path: '', 
    component: SingleEventDashboard,
    children:[
      {
      path:'',
      component:EventSummaryComponent 
      },
      {
      path:'event-summary',
      component:EventSummaryComponent 
      },
      {
      path:'event-and-ticket-types',
      component:EventAndTicketTypesComponent 
      },
      {
      path:'checkout-form',
      component:CheckoutFormComponent 
      },
      {
      path:'delete',
      component:DeleteComponent 
      }
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleEventDashboardRoutingModule { }
