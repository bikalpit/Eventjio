import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SettingService} from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';
import { AuthenticationService } from '../../../_services/authentication.service'
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {

  attachInvoice = false;
  ticketVouchersPDF = false;
  currentUser:any;
  globalOrderEmail:string = '';
  boxOfficeCode = localStorage.getItem('boxoffice_id');   
  globalOrderPre:any;

  constructor(
    private _formBuilder: FormBuilder,
    private SettingService : SettingService,
    private ErrorService: ErrorService,
    public dialog: MatDialog,
    private auth : AuthenticationService,
    private sanitizer:DomSanitizer

  ) { 
    this.auth.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.fngetGlobleEmail();
  }

  fngetGlobleEmail(){

    let requestObject = {
      "boxoffice_id": this.boxOfficeCode,
      "option_key": "global_confirmation",
      "event_id": 'null',
    };

    this.SettingService.getSettingsValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
          this.globalOrderEmail = response.response;
          this.globalOrderPre = this.sanitizer.bypassSecurityTrustHtml(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    let requestObjectData = {
      "boxoffice_id": this.boxOfficeCode,
      "option_key": "global_confirmation_setting",
      "event_id": 'null',
    };

    this.SettingService.getSettingsValue(requestObjectData).subscribe((response:any) => {
      if(response.data == true){
        let data  = JSON.parse(response.response);
        this.attachInvoice = data.attachInvoice;
        this.ticketVouchersPDF = data.ticketVouchersPDF;

      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }


  fnGlobleEmail(){

    if(this.globalOrderEmail == ''){
      this.ErrorService.errorMessage('Please Enter Global order confirmation.');
      return;
    }

    /////////////// Update Email //////////////////

    let requestObject = {
        "boxoffice_id": this.boxOfficeCode,
        "option_key": "global_confirmation",
        //"event_id": 'null',
        "json_type":"N",
        "option_value" : this.globalOrderEmail
    };

    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    /////////////// Update Email Attachment //////////////////

    let requestObjectData = {
        "boxoffice_id": this.boxOfficeCode,
        "option_key": "global_confirmation_setting",
       // "event_id": 'null',
        "json_type":"Y",
        "option_value" : { 'ticketVouchersPDF' : this.ticketVouchersPDF, 'attachInvoice' : this.attachInvoice}
    };

    this.SettingService.updateSetting(requestObjectData).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });


  }


}
