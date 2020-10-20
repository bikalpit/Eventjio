import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuperadminService } from '../_services/superadmin.service';
import { ErrorService } from '../../_services/error.service';
//import { DatePipe} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment'
import { SingleEventServiceService } from './_services/single-event-service.service';

@Component({
  selector: 'single-event-dashboard',
  templateUrl: './single-event-dashboard.html',
  styleUrls: ['./single-event-dashboard.scss']
})
export class SingleEventDashboard implements OnInit {
  pageName :any = '';
  eventStatus='draft';
  eventSideMenu:boolean = true;
  eventId:string = localStorage.getItem('selectedEventCode');
  eventDetail:any;
  boxOfficeDetail:any;

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private router: Router,
    private SuperadminService: SuperadminService,
    private SingleEventServiceService: SingleEventServiceService,

  ) {
    this.eventSideMenu = true;
  }

  ngOnInit(): void {
    this.fnGetEventDetail();
    this.fnGetBoxOfficeDetail();
  }

  fnGetEventDetail(){

    let requestObject = {
      'unique_code' : this.eventId,
    }

    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventDetail = response.response.event[0];
        if(this.eventDetail.images.length === 0){
          this.eventDetail.images = undefined
        }else{
          alert()
        }
        this.eventStatus = this.eventDetail.event_status;
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  fnGetBoxOfficeDetail(){
    let requestObject = {
      'unique_code' : localStorage.getItem('boxoffice_id'),
    }
    this.SingleEventServiceService.getSingleBoxofficeDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.boxOfficeDetail = response.response[0];
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
  }

  fnChangeEventStatus(status){

    let requestObject = {
      'unique_code' : this.eventId,
      'event_status' : status
    }

    this.SingleEventServiceService.updateEventStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }
  
  fnPostUrl(postUrl){
    this.pageName = postUrl; 
  }

  fnClickOnDuplicate(){
    this.eventSideMenu = false;
  }

  PreviewPage(){
    window.open(environment.APPURL+this.boxOfficeDetail.box_office_link+'/'+this.eventId);
  }
  
}


