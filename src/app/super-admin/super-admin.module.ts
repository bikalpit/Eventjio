import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { MaterialModule } from '../_helpers/material.module';

@NgModule({
  declarations: [DashboardComponent, EventsComponent],
  imports: [
    CommonModule, SuperAdminRoutingModule, MaterialModule
  ]
})
export class SuperAdminModule { }
