import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';


@Component({
  selector: 'app-payment-systems',
  templateUrl: './payment-systems.component.html',
  styleUrls: ['./payment-systems.component.scss']
})
export class PaymentSystemsComponent implements OnInit {

  isLoaderAdmin:boolean = false;


  paypal: FormGroup;
  bankTransfer: FormGroup;
  payumoney: FormGroup;
  stripe: FormGroup;

  paypalGuestStatus : boolean = false;
  paypalTestStatus : boolean = false;
  paypalStatus:boolean = false;
//  settingsValue: any;

  //stripeSettingValue: any;
  stripeStatus:Boolean = false;

  //payUMoneySettingValue: any;
  payumoneyStatus : boolean = false;
  bankTransferStatus : boolean = false;


  constructor(
    private settingService:SettingService,
    private _formBuilder: FormBuilder,
    private ErrorService: ErrorService,

  ) { 

    this.paypal = this._formBuilder.group({
      clientId: ['',[Validators.required]],
    });

    this.stripe = this._formBuilder.group({
      secretKey: ['',[Validators.required]],
      publishableKey: ['',[Validators.required]],
    });

    this.payumoney = this._formBuilder.group({
      merchantKey: ['',[Validators.required]],
      saltKey: ['',[Validators.required]],
    });

    this.bankTransfer = this._formBuilder.group({
      bankName: ['',[Validators.required]],
      accountName: ['',[Validators.required]], 
      accountNumber: ['',[Validators.required]], 
      branchCode: [''], 
      IFSCCode: ['',[Validators.required]], 
      bankDescription: [''], 
    });

  }

  ngOnInit(): void {

    this.getSettingsValue('paypal');
    this.getSettingsValue('Stripe');
    this.getSettingsValue('Payumoney');
    this.getSettingsValue('Bank');

    
  }

  getSettingsValue(option_key){

    let requestObject={
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "event_id" : 'NULL',
      'option_key' : option_key
    }

    this.settingService.getSettingsValue(requestObject).subscribe((response:any) => {
        if(response.data == true){

          if(option_key=='paypal'){

            let PaypalsettingsValue = JSON.parse(response.response);

            this.paypalStatus = PaypalsettingsValue.status
            this.paypalTestStatus = PaypalsettingsValue.test_mode
            this.paypal.controls['clientId'].setValue(PaypalsettingsValue.client_id)

          }

          if(option_key=='Stripe'){

            let StripesettingsValue = JSON.parse(response.response);
            this.stripeStatus = StripesettingsValue.status
            this.stripe.controls['secretKey'].setValue(StripesettingsValue.secret_key);
            this.stripe.controls['publishableKey'].setValue(StripesettingsValue.publishable_key);

          }

          if(option_key=='Payumoney'){

            let payUMoneySettingValue = JSON.parse(response.response);
            this.payumoneyStatus = payUMoneySettingValue.status
            this.payumoney.controls['merchantKey'].setValue(payUMoneySettingValue.merchant_key);
            this.payumoney.controls['saltKey'].setValue(payUMoneySettingValue.salt_key);

          }
          
          if(option_key=='Bank'){

            let bankTransferSettingValue = JSON.parse(response.response);
            this.bankTransferStatus = bankTransferSettingValue.status
            this.bankTransfer.controls['bankName'].setValue(bankTransferSettingValue.bank_name);
            this.bankTransfer.controls['accountName'].setValue(bankTransferSettingValue.account_name);
            this.bankTransfer.controls['accountNumber'].setValue(bankTransferSettingValue.account_number);
            this.bankTransfer.controls['branchCode'].setValue(bankTransferSettingValue.branch_code);
            this.bankTransfer.controls['IFSCCode'].setValue(bankTransferSettingValue.IFSC_code);
            this.bankTransfer.controls['bankDescription'].setValue(bankTransferSettingValue.bank_description);


          }

        } else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
        }
    });

  }


  fnPaypalTest(event){
    this.paypalTestStatus = event;
  }

  fnPaypalGuest(event){
    this.paypalGuestStatus = event;
  }

  fnSubmitPaypal(){

    if(this.paypal.valid){

        let PaypalSetting = {
          "client_id":this.paypal.get('clientId').value,
          "test_mode":this.paypalTestStatus,
          "status" : this.paypalStatus
        }

        let requestObject = {
          "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
          "option_key"    :  "Paypal",
          "option_value" : PaypalSetting,
          "event_id" :  null,
          'json_type' : 'Y'
        }

        this.updatePaypalSetting(requestObject);
    }

  }

  fnPaypalStatus(event){
    if(this.paypal.invalid){
      this.paypal.get('clientId').markAsTouched();
      return false;
    }
    this.paypalStatus = event;

    let PaypalSetting = {
      "client_id" : this.paypal.get('clientId').value,
      "test_mode" :  this.paypalTestStatus,
      "status"    : this.paypalStatus
    }

    let requestObject = {
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "option_key"    :  "Paypal",
      "option_value" : PaypalSetting,
      "event_id" :  null,
      'json_type' : 'Y'
    }
  
    this.updatePaypalSetting(requestObject);
  }

  updatePaypalSetting(requestObject){

    this.isLoaderAdmin = true;
    this.settingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Paypal Updated')
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }


  fnStripeStatus(event){
    if(this.stripe.invalid){
      this.stripe.get('secretKey').markAsTouched();
      this.stripe.get('publishableKey').markAsTouched();
      return false;
    }
    this.stripeStatus = event;

    let stripeSetting = {
      "secret_key":this.stripe.get('secretKey').value,
      "publishable_key":this.stripe.get('publishableKey').value,
      "status"    : this.stripeStatus,
    };

    let requestObject = {
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "option_key"    :  "Stripe",
      "option_value" : stripeSetting,
      "event_id" :  null,
      'json_type' : 'Y'
    };

    this.updateStripeSetting(requestObject);

  }

  fnSubmitStripe(){

    if(this.stripe.valid){

      let stripeSetting = {
        "secret_key":this.stripe.get('secretKey').value,
        "publishable_key":this.stripe.get('publishableKey').value,
        "status" : this.stripeStatus,
      }

      let requestObject = {
        "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
        "option_key"    :  "Stripe",
        "option_value" : stripeSetting,
        "event_id" :  null,
        'json_type' : 'Y'
      };

      this.updateStripeSetting(requestObject);
    }else if(this.stripe.invalid){
      this.stripe.get('secretKey').markAsTouched();
      this.stripe.get('publishableKey').markAsTouched();
      return false;
    }

  }

  updateStripeSetting(requestObject){

    this.isLoaderAdmin = true;

    this.settingService.updateSetting(requestObject).subscribe((response:any) => {

      if(response.data == true){
        this.ErrorService.successMessage('Stripe Updated')
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      
      this.isLoaderAdmin = false;

    });

  }


  fnPayumoneyStatus(event){
    if(this.payumoney.invalid){
      this.payumoney.get('merchantKey').markAsTouched();
      this.payumoney.get('saltKey').markAsTouched();
      return false;
    }
    
    this.payumoneyStatus = event;

    let stripeSetting = {
      "merchant_key":this.payumoney.get('merchantKey').value,
      "salt_key":this.payumoney.get('saltKey').value,
      "status" : this.payumoneyStatus,
    }

    let requestObject = {
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "option_key"    :  "Payumoney",
      "option_value" : stripeSetting,
      "event_id" :  null,
      'json_type' : 'Y'
    };

    this.updatePayumoneySetting(requestObject);
  }

  fnSubmitPayumoney(){
    if(this.payumoney.invalid){
      this.payumoney.get('merchantKey').markAsTouched();
      this.payumoney.get('saltKey').markAsTouched();
      return false;
    }
    if(this.payumoney.valid){
      
    let stripeSetting = {
      "merchant_key":this.payumoney.get('merchantKey').value,
      "salt_key":this.payumoney.get('saltKey').value,
      "status" : this.payumoneyStatus,
    }

    let requestObject = {
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "option_key"    :  "Payumoney",
      "option_value" : stripeSetting,
      "event_id" :  null,
      'json_type' : 'Y'
    };

      this.updatePayumoneySetting(requestObject);
    }

  }

  updatePayumoneySetting(requestObject){

    this.isLoaderAdmin = true;

    this.settingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('PauUMoney Updated')
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }


  fnBankTransferStatus(event){
    if(this.bankTransfer.invalid){
      this.bankTransfer.get('bankName').markAsTouched();
      this.bankTransfer.get('accountName').markAsTouched();
      this.bankTransfer.get('accountNumber').markAsTouched();
      this.bankTransfer.get('IFSCCode').markAsTouched();
      this.bankTransfer.get('branchCode').markAsTouched();
      this.bankTransfer.get('bankDescription').markAsTouched();
      return false;
    }
    this.bankTransferStatus = event;
    let bankTransferSetting = {
      "bank_name":this.bankTransfer.get('bankName').value,
      "account_name":this.bankTransfer.get('accountName').value,
      "account_number":this.bankTransfer.get('accountNumber').value,
      "IFSC_code":this.bankTransfer.get('IFSCCode').value,
      "branch_code":this.bankTransfer.get('branchCode').value,
      "bank_description":this.bankTransfer.get('bankDescription').value,
      "status" : this.bankTransferStatus
    }
    let requestObject = {
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "option_key"    :  "Bank",
      "option_value" : bankTransferSetting,
      "event_id" :  null,
      'json_type' : 'Y'
    }
    this.updateBankTransferSetting(requestObject);
    
  }

  fnSubmitBankTransfer(){

    if(this.bankTransfer.invalid){
      this.bankTransfer.get('bankName').markAsTouched();
      this.bankTransfer.get('accountName').markAsTouched();
      this.bankTransfer.get('accountNumber').markAsTouched();
      this.bankTransfer.get('IFSCCode').markAsTouched();
      this.bankTransfer.get('branchCode').markAsTouched();
      this.bankTransfer.get('bankDescription').markAsTouched();
      return false;
    }
    if(this.bankTransfer.valid){

      let bankTransferSetting = {
        "bank_name":this.bankTransfer.get('bankName').value,
        "account_name":this.bankTransfer.get('accountName').value,
        "account_number":this.bankTransfer.get('accountNumber').value,
        "IFSC_code":this.bankTransfer.get('IFSCCode').value,
        "branch_code":this.bankTransfer.get('branchCode').value,
        "bank_description":this.bankTransfer.get('bankDescription').value,
        "status" : this.bankTransferStatus
      }
      let requestObject = {
        "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
        "option_key"    :  "Bank",
        "option_value" : bankTransferSetting,
        "event_id" :  null,
        'json_type' : 'Y'
      }

      this.updateBankTransferSetting(requestObject);
    }

  }

  updateBankTransferSetting(requestObject){

    this.isLoaderAdmin = true;

    this.settingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Bank detail Updated')
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }



}
