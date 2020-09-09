import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventSummaryComponent } from './event-summary/event-summary.component';

const routes: Routes = [
  { 
    path: 'event-summary', 
    component: EventSummaryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleEventDashboardRoutingModule { }
