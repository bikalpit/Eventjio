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
import { CKEditorModule } from 'ngx-ckeditor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inviteTeamMateDialog} from './team-access/team-access.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { SalesTaxComponent } from './sales-tax/sales-tax.component';
import { AddSalesTax } from './sales-tax/sales-tax.component';
import { DialogAdminProfileImageUpload } from './my-profile/my-profile.component';
import { DialogAdminBoxofficeImageUpload } from './box-office/box-office.component';
import { HttpClientModule} from '@angular/common/http';
import { PaymentSystemsComponent } from './payment-systems/payment-systems.component';
import { addBuyerQuestionDialog, addAttendeeQuestionDialog } from './checkout-form/checkout-form.component';


@NgModule({
  declarations: [SettingsComponent, EventPageDesignComponent,ContactPreferencesComponent, CheckoutFormComponent, ButttonAndLinksComponent, WebsitesEmbedCodesComponent,TeamAccessComponent, MyProfileComponent, BoxOfficeComponent, SeatingChartsComponent, ConnectAppsComponent, BillingComponent, AddSalesTax,
    PrivacyPolicyComponent,SalesTaxComponent,
     OrderConfirmationComponent,
    inviteTeamMateDialog,
    DialogAdminProfileImageUpload,
    DialogAdminBoxofficeImageUpload,
    PaymentSystemsComponent,
    addBuyerQuestionDialog, 
    addAttendeeQuestionDialog,
  ],



 
 
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    MatExpansionModule,
    ColorPickerModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  entryComponents: [
    AddSalesTax,
    DialogAdminProfileImageUpload,
    DialogAdminBoxofficeImageUpload,
    inviteTeamMateDialog,
    addBuyerQuestionDialog, 
    addAttendeeQuestionDialog,
  ]
})
export class SettingsModule { }