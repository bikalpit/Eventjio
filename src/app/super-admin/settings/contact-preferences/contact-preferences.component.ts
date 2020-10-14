import { Component, OnInit } from '@angular/core';
import { FormControl,FormArray,FormGroup, FormBuilder, Validators, ValidatorFn} from '@angular/forms';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';

@Component({
  selector: 'app-contact-preferences',
  templateUrl: './contact-preferences.component.html',
  styleUrls: ['./contact-preferences.component.scss']
})
export class ContactPreferencesComponent implements OnInit {
  contactPreferenceOption:any;
  contactPreferenceFrom : FormGroup;
  isLoaderAdmin:any;

  constructor(
    private _formBuilder : FormBuilder,
    private SettingService : SettingService,
    private ErrorService : ErrorService
  ) { 
    this.contactPreferenceFrom = this._formBuilder.group({
      email_id:['',[Validators.required, Validators.email]],
      // instructions:['',[Validators.required]],
    })
  }

  fnSubmitContactPreference(){

    if(this.contactPreferenceFrom.valid){

        let contactPreferenceSetting = {
          "email_id":this.contactPreferenceFrom.get('email_id').value,
          // "instructions":this.contactPreferenceFrom.get('instructions').value,
        }
        let requestObject = {
          "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
          "option_key"    :  "contactPreference",
          "option_value" : contactPreferenceSetting,
          "event_id" :  null,
          'json_type' : 'Y'
        }
        this.updatecontactPreferenceSetting(requestObject);
        this.contactPreferenceFrom.reset();
    }else{
      this.contactPreferenceFrom.get('email_id').markAllAsTouched();
      // this.contactPreferenceFrom.get('instructions').markAllAsTouched();
      return false;
    }

  }
  updatecontactPreferenceSetting(requestObject){
    this.isLoaderAdmin = true;
    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Contact Preference Updated')
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }


  fnSelectionChange(event){
    this.contactPreferenceOption = event.value;
    if(event.value === "To a diffrent email address")
    {
    //   this.contactPreferenceFrom.controls["instructions"].setValidators(null);
    //   this.contactPreferenceFrom.controls["instructions"].updateValueAndValidity();
      this.contactPreferenceFrom.controls["email_id"].setValidators([Validators.required,Validators.email])
    }
    // else if(event.value === "I would like to provide instructions")
    // {
    //   this.contactPreferenceFrom.controls["email_id"].setValidators(null);
    //   this.contactPreferenceFrom.controls["email_id"].updateValueAndValidity();
    //   this.contactPreferenceFrom.controls["instructions"].setValidators(Validators.required);
    // }
    else
    {
      this.contactPreferenceFrom.controls["email_id"].setValidators(null);
      this.contactPreferenceFrom.controls["email_id"].updateValueAndValidity();
      // this.contactPreferenceFrom.controls["instructions"].setValidators(null);
      // this.contactPreferenceFrom.controls["instructions"].updateValueAndValidity();
    }
    this.contactPreferenceFrom.updateValueAndValidity();
  }
  ngOnInit(): void {
  }

}
