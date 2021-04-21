import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { ErrorService } from '../../../_services/error.service'
import { SettingService } from '../_services/setting.service';


@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.scss'],
  providers: [DatePipe]
})
export class AppUsersComponent implements OnInit {

 
  isLoaderAdmin:boolean=false;
  boxOfficeCode:any;
  allAppUsersList:any;
  constructor(public dialog: MatDialog,
    private SettingService : SettingService,
    private datePipe: DatePipe,
    private ErrorService : ErrorService,) { 
      
      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
      }
      this.getAllAppUsers();
    }

  ngOnInit(): void {
  }

  getAllAppUsers(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SettingService.getAllAppUsers(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.allAppUsersList = response.response;
      this.allAppUsersList.forEach(element => {
        element.created_at = this.datePipe.transform(element.created_at,"EEE MMM d, y")
      });
      }
      else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        this.allAppUsersList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

  fnAddAppUser() {
    const dialogRef = this.dialog.open(AddAppUser,{
      width: '700px',
      data:{
        boxOfficeCode:this.boxOfficeCode,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllAppUsers();
    });
  }

  fnUserDetail(index) {
    const dialogRef = this.dialog.open(appUserDetail,{
      width: '700px',
      data:{
        boxOfficeCode:this.boxOfficeCode,
        singleUserData: this.allAppUsersList[index]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}



@Component({
  selector: 'add-app-user',
  templateUrl: '../_dialogs/add-app-user.html',
})
export class AddAppUser {
  status:any;
  addAppUser:FormGroup;
  boxOfficeCode:any;
  isLoaderAdmin:any;
  selectedEvents:any=[];
  selectedOccurrences:any=[];
  allEventList:any;
  allEventStatus:any='N';
  emailPattern:any=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/ 
  constructor(
    private _formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AddAppUser>,
    private http: HttpClient,
    private SettingService : SettingService,
    private ErrorService : ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode
      this.getAllEvent();
      this.addAppUser = this._formBuilder.group({
        firstname:['',[Validators.required]],
        lastname:['',[Validators.required]],
        email:['',[Validators.required,Validators.pattern(this.emailPattern)]],
      })
    }

    getAllEvent(){
      this.isLoaderAdmin = true;
      let requestObject = {
        'events_id' : 'all',
        'boxoffice_id' : this.boxOfficeCode
      }
      this.SettingService.fnGetAllEventList(requestObject).subscribe((response:any) => {
        if(response.data == true){
        this.allEventList = response.response
        }
        else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
          this.allEventList = null;
        }
        this.isLoaderAdmin = false;
      })
    }

    fnAssignEvent(event, id){
      if(id !== 'all'){
        if(event.checked == true){
          this.selectedEvents.push(id)
        }else{
          const index = this.selectedEvents.indexOf(id, 0);
          if (index > -1) {
              this.selectedEvents.splice(index, 1);
          }
        }
      }else{
        this.selectedEvents = [];
        if(event.checked == true) {  
         this.allEventStatus = 'Y';
         }else{ 
          this.allEventStatus = 'N';
         }
        this.allEventList.forEach(subelement => {
          if(event.checked == true) {  
            subelement.is_selected=true;
            this.selectedEvents.push(subelement.id)
           }else{ 
            subelement.is_selected=false;
            this.selectedEvents = [];
          }
        });
      }
    }

    fnAssignOccurrence(event, id){
      if(event.checked == true){
        this.selectedOccurrences.push(id)
      }else{
        const index = this.selectedOccurrences.indexOf(id, 0);
        if (index > -1) {
            this.selectedOccurrences.splice(index, 1);
        }
      }
    }
    fnOnSubmit(){
      if(this.addAppUser.valid){
        let newUserData = {
          "boxoffice_id" : this.boxOfficeCode,
          "firstname" : this.addAppUser.get('firstname').value,
          "lastname" : this.addAppUser.get('lastname').value,
          "email" : this.addAppUser.get('email').value,
          "event_ids" : this.selectedEvents,
          "occurrence_ids" : this.selectedOccurrences,
          "all" : this.allEventStatus,
        }
        this.isLoaderAdmin = true;
        this.SettingService.createAppUser(newUserData).subscribe((response:any) => {
          if(response.data == true){
            this.ErrorService.successMessage(response.response);
            this.addAppUser.reset();
            this.dialogRef.close();
          }
          else if(response.data == false){
            this.ErrorService.errorMessage(response.response);
          }
          this.isLoaderAdmin = false;
        })

    }else{
      this.addAppUser.get("firstname").markAsTouched();
      this.addAppUser.get("lastname").markAsTouched();
      this.addAppUser.get("email").markAsTouched();
      }
    }


  onNoClick(): void {
    this.addAppUser.reset();
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}


@Component({
  selector: 'App-User-Dateils',
  templateUrl: '../_dialogs/view-app-user.html',
  providers: [DatePipe]
})
export class appUserDetail {
  singleUserData:any;
  boxOfficeCode:any;
  passwordView:boolean=false;
  allEventList:any;
  selectedEventList:any=[];
  selectedEventListCode:any=[];
  constructor(
    public dialogRef: MatDialogRef<appUserDetail>,
    private SettingService : SettingService,
    private datePipe: DatePipe,
    private ErrorService : ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.singleUserData = this.data.singleUserData;
      this.boxOfficeCode = this.data.boxOfficeCode;
      this.selectedEventListCode = this.singleUserData.events_ids.split(',')
      this.singleUserData.created_at = this.datePipe.transform(this.singleUserData.created_at,"EEE MMM d, y")
      if(this.selectedEventListCode.length > 0){
        this.getAllEvent()
      }
    }

    getAllEvent(){
      let requestObject = {
        'events_id' : 'all',
        'boxoffice_id' : this.boxOfficeCode
      }
      this.SettingService.fnGetAllEventList(requestObject).subscribe((response:any) => {
        if(response.data == true){
        this.allEventList = response.response
        this.allEventList.forEach(element => {
          const index = this.selectedEventListCode.indexOf(element.unique_code, 0);
          if (index > -1) {
              this.selectedEventList.push(element.event_title);
          }
        });
        // this.selectedEventList = JSON.stringify(this.selectedEventList)
        }
        else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
          this.allEventList = null;
        }
      })
    }


  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}

