import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { AuthenticationService } from '../../../_services/authentication.service'
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {

confirmationType :any ='GlobalOrderConfirmation';
attachEventInvoice = false;
ticketEventVouchersPDF = false;
currentUser:any;
globalOrderEmail:string = '';
eventOrderEmail:string = '';
boxOfficeCode = localStorage.getItem('boxoffice_id');   
event_id = localStorage.getItem('selectedEventCode');   
KisshtHtml;
eventOrderEmailPre;
eventDetail:any = [];

constructor(
  private _formBuilder: FormBuilder,
  private eventServiceService : SingleEventServiceService,
  private ErrorService: ErrorService,
  public dialog: MatDialog,
  private auth : AuthenticationService,
  private sanitizer:DomSanitizer

  ) { 
    this.auth.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.fnGetEventDetail();
  }

  fnEditOrderConfirmation(event){

    this.confirmationType = event.value;

    let requestObjectconfirmationType = {
      "option_key": "confirmationType",
      "event_id" : this.event_id,
      "json_type":"Y",
      "option_value" : { 'confirmationType' : this.confirmationType }
    };

    this.eventServiceService.updateSetting(requestObjectconfirmationType).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  fngetGlobleEmail(option_key){

    let requestObject = {
      "boxoffice_id": this.boxOfficeCode,
      "option_key": option_key,
      "event_id": 'null',
    };

    this.eventServiceService.getSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
          this.KisshtHtml = this.sanitizer.bypassSecurityTrustHtml(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

 
  }

  fngetEventEmail(option_key){

    let requestObject = {
      "boxoffice_id": "null",
      "option_key": option_key,
      "event_id" : this.event_id,
    };

    this.eventServiceService.getSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
          this.eventOrderEmail = response.response;
          this.eventOrderEmailPre = this.sanitizer.bypassSecurityTrustHtml(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    let requestObjectData = {
      "boxoffice_id": "null",
      "option_key": "event_confirmation_setting",
      "event_id" : this.event_id,
    };

    this.eventServiceService.getSettings(requestObjectData).subscribe((response:any) => {
      if(response.data == true){
        let data  = JSON.parse(response.response);
        this.attachEventInvoice = data.attachInvoice;
        this.ticketEventVouchersPDF = data.ticketVouchersPDF;
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    let requestObjectconfirmationType = {
      "boxoffice_id": "null",
      "option_key": "confirmationType",
      "event_id" : this.event_id,
    };

    this.eventServiceService.getSettings(requestObjectconfirmationType).subscribe((response:any) => {
      if(response.data == true){
        let data  = JSON.parse(response.response);
        this.confirmationType = data.confirmationType;
        
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  fnEventEmail(){
  
    /////////////// Update Event Email //////////////////

    let requestObject = {
        "option_key": "event_confirmation",
        "json_type" : "N",
        "event_id" : this.event_id,
        "option_value" : this.eventOrderEmail
    };

    this.eventServiceService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    /////////////// Update Email Attachment //////////////////

    let requestObjectData = {
        "option_key": "event_confirmation_setting",
        "event_id" : this.event_id,
        "json_type":"Y",
        "option_value" : { 'ticketVouchersPDF' : this.ticketEventVouchersPDF, 'attachInvoice' : this.attachEventInvoice}
    };

    this.eventServiceService.updateSetting(requestObjectData).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  fnGetEventDetail(){

    let requestObject = {
      'unique_code' : this.event_id,
    }

    this.eventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventDetail = response.response.event[0];
        
        if(this.eventDetail.online_event == "Y"){
          this.fngetGlobleEmail('global_confirmation_online');
          this.fngetEventEmail('event_confirmation_online');
        }else{
          this.fngetGlobleEmail('global_confirmation');
          this.fngetEventEmail('event_confirmation');
        }
        

        console.log('---',this.eventDetail);

      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }


}
