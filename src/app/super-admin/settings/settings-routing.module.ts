import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


<<<<<<< Updated upstream
const routes: Routes = [];
=======
const routes: Routes = [
  { 
    path: '', 
    component: SettingsComponent 
  }
];
>>>>>>> Stashed changes

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
