import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleEventDashboard } from './single-event-dashboard';
import { EventSummaryComponent } from './event-summary/event-summary.component';
//import { WaitilistSignupComponent } from './waitilist-signup/waitilist-signup.component';
import { WaitilistSignupComponent } from './waitilist-signup/waitilist-signup.component';

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
      path:'waitilist-signup',
      component:WaitilistSignupComponent
      }
     // path:'waitilist-signup',
     // component:WaitilistSignupComponent 
     // }
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleEventDashboardRoutingModule { }
