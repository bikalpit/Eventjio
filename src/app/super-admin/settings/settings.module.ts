import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_helpers/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { EventPageDesignComponent } from './event-page-design/event-page-design.component';
import { ButttonAndLinksComponent } from './buttton-and-links/buttton-and-links.component';
import { ContactPreferencesComponent } from './contact-preferences/contact-preferences.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { WebsitesEmbedCodesComponent } from './websites-embed-codes/websites-embed-codes.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { BoxOfficeComponent } from './box-office/box-office.component';
import { SeatingChartsComponent } from './seating-charts/seating-charts.component';
import { TeamAccessComponent } from './team-access/team-access.component';
import { BillingComponent } from './billing/billing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { MatExpansionModule} from '@angular/material/expansion';
import { ColorPickerModule } from 'ngx-color-picker';
import { ConnectAppsComponent } from './connect-apps/connect-apps.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [SettingsComponent, EventPageDesignComponent,ContactPreferencesComponent, CheckoutFormComponent, ButttonAndLinksComponent, WebsitesEmbedCodesComponent,TeamAccessComponent, MyProfileComponent, BoxOfficeComponent, SeatingChartsComponent, ConnectAppsComponent, BillingComponent, PrivacyPolicyComponent],

 
 
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    MatExpansionModule,
    ColorPickerModule,
    CKEditorModule,
    FormsModule
  ]
})
export class SettingsModule { }