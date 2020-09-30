import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuperadminService } from '../_services/superadmin.service';
import { ErrorService } from '../../_services/error.service';
//import { DatePipe} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'single-event-dashboard',
  templateUrl: './single-event-dashboard.html',
  styleUrls: ['./single-event-dashboard.scss']
})
export class SingleEventDashboard implements OnInit {
  pageName :any = '';
  eventStatus:any='draft';
  eventSideMenu:boolean = true;
  eventId:string = localStorage.getItem('selectedEventCode');

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private router: Router,
    private SuperadminService: SuperadminService,
  ) {
    this.eventSideMenu = true;
  }

  ngOnInit(): void {
  }

  fnChangeEventStatus(status){
    this.eventStatus = status

    let requestObject = {
      'unique_code' : this.eventId
    }

    this.SuperadminService.updateSingleEvent(requestObject).subscribe((response:any) => {
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

  
}


