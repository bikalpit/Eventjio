import { Component, OnInit ,Inject,ChangeDetectorRef } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators, FormArray, CheckboxControlValueAccessor} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-team-access',
  templateUrl: './team-access.component.html',
  styleUrls: ['./team-access.component.scss']
})
export class TeamAccessComponent implements OnInit {
  animal :any;
  allBusiness: any;
  isLoaderAdmin:any;
  allInviterData:any;
  boxofficeId:any;

  teammates = [{name:'Meet Shah',role:'Owner',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'},
  {name:'Monoj Tiwari',role:'Event Manager',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'},
  {name:'Parth Bishnoi',role:'Order Manager',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'}
]
 


  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private SettingService : SettingService,
    private ErrorService : ErrorService,
    private change : ChangeDetectorRef
  ) { 
    if(localStorage.getItem('boxoffice_id')){
      this.boxofficeId = localStorage.getItem('boxoffice_id');   
    }

  }

  getAllInviter(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id' : this.boxofficeId
    }
    this.SettingService.getAllInviter(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this. allInviterData = response.response
        console.log(this.allInviterData)
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      this.allInviterData.length = 0
      // this. allVoucherCodeList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

  ngOnInit(): void {
    this.getAllInviter();
  }

  inviteTeammate() {
    const dialogRef = this.dialog.open(inviteTeamMateDialog, {
      width: '550px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  }

  
  @Component({
    selector: 'Invite-Team-Mate',
    templateUrl: '../_dialogs/inviteTeamMateDialog.html',
  })
  
  export class inviteTeamMateDialog { 
    inviteForm:FormGroup;
    isLoaderAdmin:any;
    boxofficeId:any;
    roleType : {'A','EM','OM','OV'}  

    admin_permission:any;
    em_permission:any;
    om_permission:any;
    view_permission:any;
    email_id:string = '';
    role:string = '';
    em_sub_permission:any;
    om_AUEC_permission:any;
    om_AUER_permission:any;
    sub_permission:string = '';

    constructor(
      public dialogRef: MatDialogRef<inviteTeamMateDialog>,
      private _formBuilder: FormBuilder,
      private SettingService : SettingService,
      private ErrorService : ErrorService,
      private change : ChangeDetectorRef,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        
        this.boxofficeId = localStorage.getItem('boxoffice_id');   
      }

      fnOncheckedEM(event){

        if(event.checked == true){
          this.em_sub_permission = true;
          this.em_permission = true;
        }else{
          this.em_sub_permission = false;
        }
        this.sub_permission = 'AACD';
      }

      fnOncheckedOM(event,type){

        if(type=='AUEC'){
          this.om_AUEC_permission= event.checked;
          this.sub_permission = 'AUEC';

        }

        if(type=='AUER'){
          this.om_AUER_permission= event.checked;
          this.sub_permission = 'AUER';

        }

        if(this.om_AUEC_permission || this.om_AUER_permission){
          this.om_permission = true;
        }

        if(this.om_AUEC_permission && this.om_AUER_permission){
          this.sub_permission = 'AUEC,AUER';
        }

        this.change.detectChanges();
      }

      fnOnchecked(event,permission){

        this.admin_permission = false;
        this.em_permission = false;
        this.om_permission = false;
        this.view_permission = false;
      
        if(event.checked == true){

          if(permission=='admin_permission'){
            this.admin_permission= true;
            this.role =  'A';
          }else if(permission=='em_permission'){
            this.em_permission = true;
            this.role =  'EM';
          }else if(permission=='om_permission'){
            this.role =  'OM';
            this.om_permission = true;
          }else if(permission=='view_permission'){
            this.role =  'OV';
            this.view_permission = true;
          }

        } 
        
        this.change.detectChanges();
  

       }

  
      fnOnSubmit(){
        
        if(this.role==''){
          this.ErrorService.errorMessage('Select any permission');
          return;
        }
        
        console.log(this.email_id);

        if(this.email_id == ''){
          this.ErrorService.errorMessage('Please enter Email');
          return;
        }

        this.isLoaderAdmin = true;

        let inviteFormData ={
          'boxoffice_id' : this.boxofficeId,
          "email_id": this.email_id,
          "role": this.role,
          "permission": this.role,
          "sub_permission" : this.sub_permission,
        }   


        this.SettingService.inviteform(inviteFormData).subscribe((response:any) => {
        if(response.data == true){
          this.ErrorService.successMessage(response.response);
            this.dialogRef.close();
          } else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
          }
          this.isLoaderAdmin = false;
        });


      }

  
    onNoClick(): void {
      this.dialogRef.close();
    }
    ngOnInit() {
    }
    
  }
  