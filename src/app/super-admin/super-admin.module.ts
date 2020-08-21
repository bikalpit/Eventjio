import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';


@NgModule({
  declarations: [DashboardComponent, EventsComponent],
  imports: [
    CommonModule, SuperAdminRoutingModule,
  ]
})
export class SuperAdminModule { }
