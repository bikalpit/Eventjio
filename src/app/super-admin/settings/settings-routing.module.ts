import { NgModule,  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { EventPageDesignComponent } from './event-page-design/event-page-design.component';
import { ButttonAndLinksComponent } from './buttton-and-links/buttton-and-links.component';
import { ContactPreferencesComponent } from './contact-preferences/contact-preferences.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';

import { WebsitesEmbedCodesComponent } from './websites-embed-codes/websites-embed-codes.component';

const routes: Routes = [{ path: '', component: SettingsComponent, 

                          children:[{
                            path:'',
                            component:EventPageDesignComponent
                          },

                            {
                              path:'buttonsandlinks',
                              component:ButttonAndLinksComponent}
                            ]
                          },
                          { 
                            path: 'contact-preferences', 
                            component: ContactPreferencesComponent
                          },
                          { 
                            path: 'checkout-form', 
                            component: CheckoutFormComponent
                          },
                          {
                            path:'websitesembedcodes',
                            component:WebsitesEmbedCodesComponent
                          },
                        ]
                         
                         

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
