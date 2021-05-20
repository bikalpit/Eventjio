import { Component, OnInit,ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';


@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
 privacyPolicesForm:FormGroup;
 isLoaderAdmin:any;

  constructor( 
    public dialog: MatDialog,
    private _formBuilder:FormBuilder,
    private SettingService : SettingService,
    private ErrorService : ErrorService
  ) {
    this.privacyPolicesForm = this._formBuilder.group({
      updatePolicy:['',Validators.required],
    })
   }


   fnPrivacyPolices(){

    if(this.privacyPolicesForm.valid){

        let privacyPolices = {
          "updatePolicy":this.privacyPolicesForm.get('updatePolicy').value,
        }
        let requestObject = {
          "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
          "option_key"    :  "privacyPolices",
          "option_value" : privacyPolices,
          "event_id" :  null,
          'json_type' : 'Y'
        }
        this.updateprivacyPolices(requestObject);
        this.privacyPolicesForm.reset();
    }else{
      this.privacyPolicesForm.get('updatePolicy').markAllAsTouched();
      return false;
    }

  }
  updateprivacyPolices(requestObject){
    this.isLoaderAdmin = true;
    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Privacy polices Updated')
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }

  

  fnCancel(){
    this.privacyPolicesForm.reset();
  }

  ngOnInit(): void {

  }

  fnPrivacyPolicyGenerate() {
    const dialogRef = this.dialog.open(PrivacyPolicyGenerateDialog,{
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    
    });
  }

}
@Component({
  selector: 'app-privacy-policy-generate',
  templateUrl: '../_dialogs/privacy-policy-generate.component.html',
})
export class PrivacyPolicyGenerateDialog implements OnInit {
  preview:boolean = false;
  generatePrivacyPolicyForm:FormGroup;
  privacyPolicyData:any = [];
  textMessage:any;
  constructor(
    public dialogRef: MatDialogRef<PrivacyPolicyGenerateDialog>,
    private _formBuilder:FormBuilder
  ){
    this.generatePrivacyPolicyForm = this._formBuilder.group({
      orgName:['',[Validators.required]],
      orgAddress:['',[Validators.required]],
      orgEmail:['',[Validators.required,Validators.email]],
      orgContact:[''],
      emailMarketing:['',[Validators.required]],
      advertisingNetwork:['',[Validators.required]],
      acceptTerm:['',[Validators.required]]
    })
  }

  fnGeneratePolicy(){
    if(this.generatePrivacyPolicyForm.valid){
      this.privacyPolicyData ={
        'orgName':this.generatePrivacyPolicyForm.get('orgName').value,
        'orgAddress':this.generatePrivacyPolicyForm.get('orgAddress').value,
        'orgEmail':this.generatePrivacyPolicyForm.get('orgEmail').value,
        'orgContact':this.generatePrivacyPolicyForm.get('orgContact').value,
        'emailMarketing':this.generatePrivacyPolicyForm.get('emailMarketing').value,
        'advertisingNetwork':this.generatePrivacyPolicyForm.get('advertisingNetwork').value,
        'acceptTerm':this.generatePrivacyPolicyForm.get('acceptTerm').value
      }
      console.log(this.privacyPolicyData)
      this.fnPreview();
    }else{
      this.generatePrivacyPolicyForm.get('orgName').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('orgAddress').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('orgEmail').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('orgContact').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('emailMarketing').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('advertisingNetwork').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('acceptTerm').markAllAsTouched();
    }
  }

  fnPreview(){
    this.preview = !this.preview;
  }

  copyText(val:any){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }

  ngOnInit(): void {

  }

  onNoClick(){
    this.generatePrivacyPolicyForm.reset();
    this.dialogRef.close();
  }

}





