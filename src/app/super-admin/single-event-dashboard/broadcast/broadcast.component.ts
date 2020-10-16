import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators, } from '@angular/forms';
import { ErrorService } from '../../../_services/error.service'
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { AuthenticationService } from '../../../_services/authentication.service'
import { DatePipe} from '@angular/common';
export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss'],
  providers: [DatePipe]
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
  scheduledDate:any;
  unique_id:any;
  messageContent:any;
  status:string = "draft";
  constructor(public dialog: MatDialog,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private ErrorService:ErrorService,
    private SingleEventServiceService : SingleEventServiceService,
    private auth : AuthenticationService,
    private datePipe: DatePipe,
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
    // console.log(this.createBroadcastForm);
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
    }else{
     
      this.createBroadcastData = { 
        "recipients" : this.createBroadcastForm.get('recipients').value,
        "subject" : this.createBroadcastForm.get('subject').value,
        "message" : this.createBroadcastForm.get('message').value,
        "send" : this.createBroadcastForm.get('send').value,
        "scheduledDate" : this.scheduledDate,
        "scheduledTime" : this.createBroadcastForm.get('scheduledTime').value,
        "scheduledInterval" : this.createBroadcastForm.get('scheduledInterval').value,
        "terms" : this.createBroadcastForm.get('terms').value,
        "event_id" : this.eventId, 
        "unique_code" : this.unique_id,
        "status": this.status
      }
      this.sendBroadcast(this.createBroadcastData);
      this.createBroadcastForm.reset();
    }
   
  }

  fnSelectionChange(event){
    // this.sendOptions = event.value; 
    if(event.value == 'AT_SED_DATE_TIME'){
      this.sendOptions = event.value;
      this.createBroadcastForm.controls["scheduledInterval"].setValidators(null);
      this.createBroadcastForm.controls["scheduledInterval"].updateValueAndValidity();
      this.createBroadcastForm.controls["scheduledDate"].setValidators(Validators.required)
      this.createBroadcastForm.controls["scheduledTime"].setValidators(Validators.required)
      this.createBroadcastForm.controls["scheduledDate"].updateValueAndValidity();
      this.createBroadcastForm.controls["scheduledTime"].updateValueAndValidity();
      alert(this.createBroadcastForm.get('scheduledDate').value)
     
    } else if(event.value == 'IMM'){
      this.sendOptions = event.value;
      this.createBroadcastForm.controls["scheduledInterval"].setValidators(null);
      this.createBroadcastForm.controls["scheduledDate"].setValidators(null);
      this.createBroadcastForm.controls["scheduledTime"].setValidators(null);
      this.createBroadcastForm.controls["scheduledInterval"].updateValueAndValidity();
      this.createBroadcastForm.controls["scheduledDate"].updateValueAndValidity();
      this.createBroadcastForm.controls["scheduledTime"].updateValueAndValidity();
      // if(this.createBroadcastForm.get('scheduledDate').value !== null){
      //   this.scheduledDate = this.datePipe.transform(new Date(this.createBroadcastForm.get('scheduledDate').value),"yyyy-MM-dd")
      // };
    }else{
      this.sendOptions = event.value;
      this.createBroadcastForm.controls["scheduledDate"].setValidators(null);
      this.createBroadcastForm.controls["scheduledTime"].setValidators(null);
      this.createBroadcastForm.controls["scheduledDate"].updateValueAndValidity();
      this.createBroadcastForm.controls["scheduledTime"].updateValueAndValidity();
      this.createBroadcastForm.controls["scheduledInterval"].setValidators(Validators.required);
    }
    this.createBroadcastForm.updateValueAndValidity();
    
  }

  fnChangeEventStartDate(){
    if(this.createBroadcastForm.get('scheduledDate').value !== null){
      this.scheduledDate = this.datePipe.transform(new Date(this.createBroadcastForm.get('scheduledDate').value),"yyyy-MM-dd")
    };
    this.startDate = this.createBroadcastForm.get('scheduledDate').value;
  }

  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response
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
        //  console.log(this.allWaitingListData)
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
       'event_id' : this.eventId,
       'unique_code' : this.unique_id
    }
    this.SingleEventServiceService.getAllBroadcast(requestObject).subscribe((response:any) => {
      if(response.data == true){
         this.getAllBroadcastData = response.response;
        //  console.log(this.getAllBroadcastData);
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

  previewBroadcast(index){    
    this.sendBroadcast(this.getAllBroadcastData[index]);
  }

  
  
sendBroadcast(broadcastData) {
  const dialogRef = this.dialog.open(mySendBroadcastDialog, {
    width: '650px',
    data:{createBroadcastData : broadcastData}
    
  });
   dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
   });
}


}

// --------------------------------------- Send-Broadcast -------------------------------------------
@Component({
  selector: 'Send-Broadcast',
  templateUrl: '../_dialogs/send-broadcast.html',
})

export class mySendBroadcastDialog{ 
  createBroadcastData:any;
  isLoaderAdmin:any;
  buttonHide:any = false;
  editor1 = 'Angular 4';
  datav: any = `<p>Hello, world!</p>`;
  editorValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<mySendBroadcastDialog>,
    private http: HttpClient,
    private SingleEventServiceService :SingleEventServiceService,
    private ErrorService : ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.createBroadcastData = this.data;
      this.editorValue = this.createBroadcastData.createBroadcastData.message;
      console.log(this.editorValue);
    }
    createBroadcastfrm(createBroadcastData){
      this.isLoaderAdmin = true;
      this.SingleEventServiceService.createBroadcastfrm(createBroadcastData.createBroadcastData).subscribe((response:any) => {
        if(response.data == true){
         this.ErrorService.successMessage(response.response);
         this.dialogRef.close();
        }
        else if(response.data == false){
         this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      })
    }
    

  onNoClick(): void {
    this.dialogRef.close();
  }




  ngOnInit() { 
   
  }
  }


