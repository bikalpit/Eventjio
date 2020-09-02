import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_helpers/material.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { EventPageDesignComponent } from './event-page-design/event-page-design.component';
import { ButttonAndLinksComponent } from './buttton-and-links/buttton-and-links.component';
import { WebsitesEmbedCodesComponent } from './websites-embed-codes/websites-embed-codes.component';

@NgModule({
  declarations: [SettingsComponent, EventPageDesignComponent, ButttonAndLinksComponent, WebsitesEmbedCodesComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule
  ]
})
export class SettingsModule { }