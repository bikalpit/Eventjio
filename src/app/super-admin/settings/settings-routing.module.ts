import { NgModule,  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { EventPageDesignComponent } from './event-page-design/event-page-design.component';
import { ButttonAndLinksComponent } from './buttton-and-links/buttton-and-links.component';
import { WebsitesEmbedCodesComponent } from './websites-embed-codes/websites-embed-codes.component';

const routes: Routes = [{ path: '', component: SettingsComponent, 

                          children:[{
                            path:'',
                            component:EventPageDesignComponent
                          },

                          {
                            path:'buttonsandlinks',
                            component:ButttonAndLinksComponent
                          },
                          {
                            path:'websitesembedcodes',
                            component:WebsitesEmbedCodesComponent
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
