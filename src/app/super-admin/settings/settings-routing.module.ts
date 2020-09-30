import { NgModule,  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { EventPageDesignComponent } from './event-page-design/event-page-design.component';
import { ButttonAndLinksComponent } from './buttton-and-links/buttton-and-links.component';
import { ContactPreferencesComponent } from './contact-preferences/contact-preferences.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { TeamAccessComponent } from './team-access/team-access.component';

import { WebsitesEmbedCodesComponent } from './websites-embed-codes/websites-embed-codes.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { BoxOfficeComponent } from './box-office/box-office.component';
import { ConnectAppsComponent } from './connect-apps/connect-apps.component';
import { SeatingChartsComponent } from './seating-charts/seating-charts.component';
import { BillingComponent } from './billing/billing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SalesTaxComponent } from './sales-tax/sales-tax.component';
import { PaymentSystemsComponent } from './payment-systems/payment-systems.component';


const routes: Routes = [{ path: '', component: SettingsComponent, 

                          children:[{
                            path:'',
                            component:EventPageDesignComponent
                          },
                          {
                            path:'event-page-design',
                            component:ButttonAndLinksComponent
                          },

                          {
                            path:'buttons-and-links',
                            component:ButttonAndLinksComponent
                          },
                          {
                            path:'websites-embed-codes',
                            component:WebsitesEmbedCodesComponent
                          },
                          {
                            path:'seating-charts',
                            component:SeatingChartsComponent
                          },
                          {
                            path:'my-profile',
                            component:MyProfileComponent
                          },
                          {
                            path:'order-confirmation',
                            component:OrderConfirmationComponent
                          },
                          {
                            path:'box-office',
                            component:BoxOfficeComponent
                          },
                          {
                            path:'billing',
                            component:BillingComponent
                          },
                          {
                            path:'sales-tax',
                            component:SalesTaxComponent
                          },
                          { 
                            path: 'contact-preferences', 
                            component: ContactPreferencesComponent
                          },
                          { 
                            path: 'privacy-policy', 
                            component: PrivacyPolicyComponent
                          },
                          { 
                            path: 'checkout-form', 
                            component: CheckoutFormComponent
                          },

                          { 
                            path: 'team-access', 
                            component: TeamAccessComponent
                          },
                          { 
                            path: 'connect-app', 
                            component: ConnectAppsComponent
                          },
                          { 
                            path: 'payment-systems', 
                            component: PaymentSystemsComponent
                          },

                          ]
                          }]
                         
                         
                         

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
