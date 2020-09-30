import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { Role } from './_models';
import { AuthGuard } from './_helpers/auth.guard';
import { PreviewEventsComponent } from './preview-events/preview-events.component';


const routes: Routes = [
  
  
  { 
    path: 'customers', 
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) 
  },
  
  { 
    path: 'super-admin', 
    canActivate: [AuthGuard],
    data: {roles: Role.Admin},
    loadChildren: () => import('./super-admin/super-admin.module').then(m => m.SuperAdminModule) },  
  
  { 
    path: 'settings', 
    loadChildren: () => import('./super-admin/settings/settings.module').then(m => m.SettingsModule) 
  },
  {
    path: '', 
    component: LoginComponent 
  },
   {
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'forgot-password', 
    component: ForgotPasswordComponent 
  },
  {
    path: 'sign-up', 
    component: SignupComponent 
  },
  {
    path: 'reset-password', 
    component: ResetPasswordComponent 
  },
  {
    path: 'preview-events', 
    component: PreviewEventsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
