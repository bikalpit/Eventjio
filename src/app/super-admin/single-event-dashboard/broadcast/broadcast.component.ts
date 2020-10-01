import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ErrorService } from '../../../_services/error.service'
import {SingleEventServiceService} from '../_services/single-event-service.service';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {
  animal :any;
  allBusiness: any;
  createBroadcast: any = true;
  createBroadcastForm: FormGroup;
  isLoaderAdmin:any;
  eventId:any;
  fullDayTimeSlote:any;
  createBroadcastData:any;
  sendOptions:any;
  constructor(public dialog: MatDialog,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private ErrorService:ErrorService,
    private SingleEventServiceService : SingleEventServiceService,
    ) { 
      if(localStorage.getItem('selectedEventCode')){
        this.eventId = localStorage.getItem('selectedEventCode');
      }
    
    this.createBroadcastForm = this._formBuilder.group({
        recipients:['',[]],
        subject:['',[]],
        message:['',[]],
        send:['',[]],
        scheduledDate:['',[]],
        scheduledTime:['',[]],
        scheduledInterval:['',[]],
        terms:['',[]]
    });
  }

  fnOnSubmitForm(){
    if(this.createBroadcastForm.valid){
      this.createBroadcastData = { 
        "recipients" : this.createBroadcastForm.get('recipients').value,
        "subject" : this.createBroadcastForm.get('subject').value,
        "message" : this.createBroadcastForm.get('message').value,
        "send" : this.createBroadcastForm.get('send').value,
        "scheduledDate" : this.createBroadcastForm.get('scheduledDate').value,
        "scheduledTime" : this.createBroadcastForm.get('scheduledTime').value,
        "scheduledInterval" : this.createBroadcastForm.get('scheduledInterval').value,
        "terms" : this.createBroadcastForm.get('terms').value,
        "event_id" : this.eventId, 
      }
      this.createBroadcastForm.reset();
      // console.log(this.createBroadcastData)
    }else{
      this.createBroadcastForm.get('recipients').markAllAsTouched();
      this.createBroadcastForm.get('subject').markAllAsTouched();
      this.createBroadcastForm.get('message').markAllAsTouched();
      this.createBroadcastForm.get('send').markAllAsTouched();
      this.createBroadcastForm.get('scheduledDate').markAllAsTouched();
      this.createBroadcastForm.get('scheduledTime').markAllAsTouched();
      this.createBroadcastForm.get('scheduledInterval').markAllAsTouched();
      this.createBroadcastForm.get('terms').markAllAsTouched();

    }
  }

  fnSelectionChange(event){
    this.sendOptions = event.value;
    
  }

  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response
      //  console.log(this.fullDayTimeSlote)
      }
    });
  }
      

  fnCreateBroadcast(){
    this.createBroadcast = !this.createBroadcast;
  }
  ngOnInit(): void {
    this.getTimeSlote();
  }
  
  sendBroadcast() {
    this.fnOnSubmitForm()
    const dialogRef = this.dialog.open(mySendBroadcastDialog, {
      width: '550px',
      data:{createBroadcastData: this.createBroadcastData}
      
    });
 
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
  previewBroadcast() {
    const dialogRef = this.dialog.open(myPreviewBroadcastDialog, {
      width: '550px',
      data:{ createBroadcastData : this.createBroadcastData}
    });
 
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
}
@Component({
  selector: 'Send-Broadcast',
  templateUrl: '../_dialogs/send-broadcast.html',
})

export class mySendBroadcastDialog{ 
  createBroadcastData:any;
  constructor(
    public dialogRef: MatDialogRef<mySendBroadcastDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.createBroadcastData = this.data;

      console.log(this.createBroadcastData)
      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    
  }
  
}

@Component({
  selector: 'Preview-Broadcast',
  templateUrl: '../_dialogs/Preview-broadcast.html',
})

export class myPreviewBroadcastDialog{ 
  createBroadcastData:any[] = [] ;
  constructor(
    public dialogRef: MatDialogRef<myPreviewBroadcastDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    
   
  }
}
