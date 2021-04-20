import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './_helpers/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DialogAuthentication } from './_services/auth.component';
import { ConfirmationDialogComponent } from './_components/confirmation-dialog/confirmation-dialog.component';
import {OnlyNumberDirective} from './only-number.directive';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider,GoogleLoginProvider } from 'angularx-social-login';
import { ErrorInterceptor } from './_helpers';
// import { CookieService } from "angular2-cookie/services/cookies.service";
import { AngularEditorModule } from '@kolkov/angular-editor';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("458577402908-0dgkkip4akvlppbb6lkr35l5rv4c5rdi.apps.googleusercontent.com")
    // client secret : hkt7YbBErtkhOwUMOHWF7FYz
    // provider: new GoogleLoginProvider("51939399095-dc6gpul854b6gba2712cdq1tjram4047.apps.googleusercontent.com")

  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('2885117205032998')
    // provider: new FacebookLoginProvider('742513126584702')
    //provider: new FacebookLoginProvider('2273509446292254')
    // Facebook url : https://developers.facebook.com/apps
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DialogAuthentication,
    ConfirmationDialogComponent,
    OnlyNumberDirective

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatCheckboxModule,
    MaterialModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SocialLoginModule,
	AngularEditorModule,
  ],
  entryComponents: [
    DialogAuthentication,
    ConfirmationDialogComponent
  ],
  providers: [   
    // CookieService,   
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: AuthServiceConfig, useFactory: provideConfig },
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
