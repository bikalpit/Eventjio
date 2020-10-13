import { Component, OnInit ,Inject } from '@angular/core';
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
    constructor(
      public dialogRef: MatDialogRef<inviteTeamMateDialog>,
      private http: HttpClient,
      private _formBuilder: FormBuilder,
      private SettingService : SettingService,
      private ErrorService : ErrorService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        if(localStorage.getItem('boxoffice_id')){
          this.boxofficeId = localStorage.getItem('boxoffice_id');   
        }
        this.inviteForm = this._formBuilder.group({
          admin_id:[''],
          email_id:[''],
          status:[''],
          // role:[''],
          permission:[''],
          sub_permission:[''],
          checkGroup:[{
            admin:[''],
            eventManager:[''],
            orderManager:[''],
            overView:['']
          }]

        })
      }

      fnOnchecked(event){
        console.log(event);
        alert(event.source.value);
        if(event.source.value === "A"){
          this.inviteForm.controls['checkGroup.admin'].value == true 
          this.inviteForm.controls['checkGroup.eventManager'].value == false 
          this.inviteForm.controls['checkGroup.orderManager'].value == false 
          this.inviteForm.controls['checkGroup.overView'].value == false 
        }else if(event.source.value === "EM"){
          this.inviteForm.controls['checkGroup.admin'].value == false 
          this.inviteForm.controls['checkGroup.eventManager'].value == true 
          this.inviteForm.controls['checkGroup.orderManager'].value == false 
          this.inviteForm.controls['checkGroup.overView'].value == false 
        }else if(event.source.value === "OM"){
          this.inviteForm.controls['checkGroup.admin'].value == false 
          this.inviteForm.controls['checkGroup.eventManager'].value == false 
          this.inviteForm.controls['checkGroup.orderManager'].value == true 
          this.inviteForm.controls['checkGroup.overView'].value == false 
        }else if(event.source.value === "OV"){
          this.inviteForm.controls['checkGroup.admin'].value == false 
          this.inviteForm.controls['checkGroup.eventManager'].value == false 
          this.inviteForm.controls['checkGroup.orderManager'].value == false 
          this.inviteForm.controls['checkGroup.overView'].value == true 
        }
      }

  
      fnOnSubmit(){
        if(this.inviteForm.invalid){
          this.inviteForm.get('admin_id').markAllAsTouched();
          this.inviteForm.get('email_id').markAllAsTouched();
          this.inviteForm.get('status').markAllAsTouched();
          this.inviteForm.get('admin').markAllAsTouched();
          this.inviteForm.get('eventManager').markAllAsTouched();
          this.inviteForm.get('orderManager').markAllAsTouched();
          this.inviteForm.get('statuoverViews').markAllAsTouched();
          // this.inviteForm.get('role').markAllAsTouched();
          this.inviteForm.get('permission').markAllAsTouched();
          this.inviteForm.get('sub_permission').markAllAsTouched();
        }else{
          
          console.log(this.inviteForm)
          this.isLoaderAdmin = true;
          let inviteFormData ={
            'boxoffice_id' : this.boxofficeId,
            "admin_id": this.inviteForm.get('admin_id').value,
            "email_id": this.inviteForm.get('email_id').value,
            "status": this.inviteForm.get('status').value,
            "role": this.inviteForm.get('Checkdgroup').value,
            "permission": this.inviteForm.get('Checkdgroup').value,
            "sub_permission": this.inviteForm.get('sub_permission').value,

          }   
          console.log()
          this.SettingService.inviteform(inviteFormData).subscribe((response:any) => {
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

      }

  
    onNoClick(): void {
      this.dialogRef.close();
    }
    ngOnInit() {
    }
    
  }
  