import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ErrorService } from '../../../_services/error.service'
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { AuthenticationService } from '../../../_services/authentication.service'
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
  allWaitingListData:any;
  BoxofficeId:any;
  sendOptions:any;
  startDate:any = new Date();
  getAllBroadcastData:any;
  constructor(public dialog: MatDialog,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private ErrorService:ErrorService,
    private SingleEventServiceService : SingleEventServiceService,
    private auth : AuthenticationService
    ) { 
     
      if(localStorage.getItem('boxoffice_id')){
        this.BoxofficeId = localStorage.getItem('boxoffice_id');
      }
      if(localStorage.getItem('selectedEventCode')){
        this.eventId = localStorage.getItem('selectedEventCode');
      }      
     
    this.createBroadcastForm = this._formBuilder.group({
        recipients:['',[Validators.required]],
        subject:['',[Validators.required]],
        message:['',[Validators.required]],
        send:['',[Validators.required]],
        scheduledDate:['',[Validators.required]],
        scheduledTime:['',[Validators.required]],
        scheduledInterval:['',[Validators.required]],
        terms:['',[Validators.required]]
    });
  }



  fnOnSubmitForm(){

    if(this.createBroadcastForm.invalid){
      this.createBroadcastForm.get('recipients').markAllAsTouched();
      this.createBroadcastForm.get('subject').markAllAsTouched();
      this.createBroadcastForm.get('message').markAllAsTouched();
      this.createBroadcastForm.get('send').markAllAsTouched();
      this.createBroadcastForm.get('scheduledDate').markAllAsTouched();
      this.createBroadcastForm.get('scheduledTime').markAllAsTouched();
      this.createBroadcastForm.get('scheduledInterval').markAllAsTouched();
      this.createBroadcastForm.get('terms').markAllAsTouched();
      return false;
    }

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

        

    // if(this.createBroadcastForm.valid){
    //   this.createBroadcastData = { 
    //     "recipients" : this.createBroadcastForm.get('recipients').value,
    //     "subject" : this.createBroadcastForm.get('subject').value,
    //     "message" : this.createBroadcastForm.get('message').value,
    //     "send" : this.createBroadcastForm.get('send').value,
    //     "scheduledDate" : this.createBroadcastForm.get('scheduledDate').value,
    //     "scheduledTime" : this.createBroadcastForm.get('scheduledTime').value,
    //     "scheduledInterval" : this.createBroadcastForm.get('scheduledInterval').value,
    //     "terms" : this.createBroadcastForm.get('terms').value,
    //     "event_id" : this.eventId, 
      
    //   }
    //   this.sendBroadcast();
    // }else{
    //   this.createBroadcastForm.get('recipients').markAllAsTouched();
    //   this.createBroadcastForm.get('subject').markAllAsTouched();
    //   this.createBroadcastForm.get('message').markAllAsTouched();
    //   this.createBroadcastForm.get('send').markAllAsTouched();
    //   this.createBroadcastForm.get('scheduledDate').markAllAsTouched();
    //   this.createBroadcastForm.get('scheduledTime').markAllAsTouched();
    //   this.createBroadcastForm.get('scheduledInterval').markAllAsTouched();
    //   this.createBroadcastForm.get('terms').markAllAsTouched();

    // }
  }

  fnSelectionChange(event){
    this.sendOptions = event.value;
  }

  fnChangeEventStartDate(){
    this.startDate = this.createBroadcastForm.get('scheduledDate').value;
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
   
  getWaitingList(){
    this.isLoaderAdmin = true;
    let requestObject = {
       'boxoffice_id' : this.BoxofficeId,
       'event_id' : this.eventId
    }
    this.SingleEventServiceService.getWaitingList(requestObject).subscribe((response:any) => {
      if(response.data == true){
         this.allWaitingListData = response.response;
         console.log(this.allWaitingListData)

      } else if(response.data == false){

        this.ErrorService.errorMessage(response.response);
        this. allWaitingListData = null;

      }
      this.isLoaderAdmin = false;
    })
    
  }

  getAllBroadcast(){
    this.isLoaderAdmin = true;
    let requestObject = {
       'event_id' : this.eventId
    }
    this.SingleEventServiceService.getAllBroadcast(requestObject).subscribe((response:any) => {
      if(response.data == true){
         this.getAllBroadcastData = response.response;
         console.log(this.getAllBroadcastData);

      } else if(response.data == false){

        this.ErrorService.errorMessage(response.response);
        this. getAllBroadcastData = null;

      }
      this.isLoaderAdmin = false;
    })
    
  }




fnCreateBroadcast(){
    this.createBroadcast = !this.createBroadcast;
    this.getWaitingList();
  }
  ngOnInit(): void {
    this.getTimeSlote();
    this.getAllBroadcast();
    this.getWaitingList();
  }
  
sendBroadcast() {
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
