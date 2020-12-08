import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import { ErrorService } from '../../../_services/error.service'
import { SettingService } from '../_services/setting.service';


@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.scss']
})
export class AppUsersComponent implements OnInit {

 
  isLoaderAdmin:boolean=false;
  boxOfficeCode:any;
  allAddTax:any = [];
  singleTaxData:any;
  status:any;
  taxStatus:any;
  boxOfficeSalesTax:any = 'N';
  constructor(public dialog: MatDialog,
    private SettingService : SettingService,
    private ErrorService : ErrorService,) { 
      
      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
      }

      
    }

  ngOnInit(): void {
  }

  fnAddAppUser() {
    const dialogRef = this.dialog.open(AddAppUser,{
      width: '700px',
      data:{
        boxOfficeCode:this.boxOfficeCode,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  fnUserDetail() {
    const dialogRef = this.dialog.open(appUserDetail,{
      width: '700px',
      data:{
        boxOfficeCode:this.boxOfficeCode,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
  allEventList:any;
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
        'filter' : 'upcoming',
        'boxoffice_id' : this.boxOfficeCode
      }
      this.SettingService.fnGetAllEventList(requestObject).subscribe((response:any) => {
        if(response.data == true){
        this.allEventList = response.response
        console.log(this.allEventList)
        }
        else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
          this.allEventList = null;
        }
        this.isLoaderAdmin = false;
      })
    }

    // fnchangeStatus(event){
    //   if(event.checked == true){
    //     this.taxStatus = 'Y';
    //   }
    //   else if(event.checked == false){
    //     this.taxStatus = 'N';
    //   }
    // }
    fnOnSubmit(){
      if(this.addAppUser.valid){
        let newUserData = {
          "boxoffice_id" : this.boxOfficeCode,
          "firstname" : this.addAppUser.get('firstname').value,
          "lastname" : this.addAppUser.get('lastname').value,
          "email" : this.addAppUser.get('email').value,
          "event_ids" : this.selectedEvents,
        }
        this.isLoaderAdmin = true;
        this.SettingService.createAppUser(newUserData).subscribe((response:any) => {
          if(response.data == true){
            this.ErrorService.successMessage(response.response);
            console.log(newUserData);
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
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}


@Component({
  selector: 'App-User-Dateils',
  templateUrl: '../_dialogs/view-app-user.html',
})
export class appUserDetail {
  status:any;
  // addTaxForm:FormGroup;
  boxOfficeCode:any;
  isLoaderAdmin:any;
  singleTaxData:any;
  taxStatus:any = 'N';

  constructor(
    private _formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<appUserDetail>,
    private http: HttpClient,
    private SettingService : SettingService,
    private ErrorService : ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
    }

    fnOnSubmit(){}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}

