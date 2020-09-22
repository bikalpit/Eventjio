import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SuperadminService } from '../_services/superadmin.service';
import { AuthenticationService } from '../../_services/authentication.service';
export interface DialogData {
  animal: string;
  name: string;
} 

@Component({
  selector: 'app-my-boxoffice',
  templateUrl: './my-boxoffice.component.html',
  styleUrls: ['./my-boxoffice.component.scss']
})
export class MyBoxofficeComponent implements OnInit {

  allBoxoffice: any;
  adminSettings : boolean = false;
  isLoaderAdmin : boolean = false;
  currentUser:any;
  adminId:any;
  token:any;
  getIpAddress : any;
 
  constructor(

    public dialog: MatDialog,
    public router: Router,
    public superadminService : SuperadminService,
    private authenticationService : AuthenticationService,

    ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      localStorage.setItem('isBoxoffice','true')
      console.log(this.currentUser)
     }

    ngOnInit(): void {
      this.getAllBoxoffice();
    }

    ngAfterViewInit() {
      
    }

    getAllBoxoffice(){
      let requestObject = {
          'admin_id' : this.currentUser.user_id,
      };
      this.isLoaderAdmin = true;
      this.superadminService.getAllBoxoffice(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.allBoxoffice = response.response
        }else if(response.data == false){

        }
      });
      this.isLoaderAdmin = false;

    }

  
    fnSelectBoxoffice(boxoffice_code,name){

      localStorage.setItem('boxoffice_id', boxoffice_code);
      localStorage.setItem('boxoffice_name', name);
      localStorage.setItem('isBoxoffice','false');
      this.router.navigate(['/super-admin/events']);

    }

    fnCreateBoxOffice() {
      const dialogRef = this.dialog.open(myCreateNewBoxofficeDialog, {
        width: '1100px',
        data : {adminId : this.currentUser.user_id}
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getAllBoxoffice();
      });
    }
}


@Component({
  selector: 'create-new-boxoffice-dialog',
  templateUrl: '../_dialogs/create-new-boxoffice-dialog.html',
})
export class myCreateNewBoxofficeDialog {
 
  createBoxoffice :FormGroup;
  isLoaderAdmin : boolean = false;
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  allCurency: any;
  allCountry: any;
  admin_id :any;

  constructor(
    public dialogRef: MatDialogRef<myCreateNewBoxofficeDialog>,
    public router: Router,
    private superadminService: SuperadminService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.admin_id = this.data.adminId;
      this.getAllCountry();
      this.getAllCurrancy();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

    this.createBoxoffice = this._formBuilder.group({
      boxoffice_name : ['', [Validators.required]],
      boxoffice_type : ['', [Validators.required]],
      boxoffice_country : ['', Validators.required],
      boxoffice_billing_currency : ['', Validators.required],
      boxoffice_genre : ['', Validators.required],
      boxoffice_genre_type : ['', Validators.required],
    });

  }

  getAllCountry(){
    this.superadminService.getAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
      }
    });
  }
  
  getAllCurrancy(){

    this.superadminService.getAllCurrancy().subscribe((response:any) => {
      if(response.data == true){
        this.allCurency = response.response
      }else if(response.data == false){
          
      }
    });

  }


  fnCreateBoxOffice(){

    if(this.createBoxoffice.valid){

      var insertArr = {
        "admin_id": this.admin_id,
        "box_office_name" : this.createBoxoffice.get('boxoffice_name').value,
        "type" : this.createBoxoffice.get('boxoffice_type').value,
        "currency" : this.createBoxoffice.get('boxoffice_billing_currency').value,
        "country" : this.createBoxoffice.get('boxoffice_billing_currency').value,
        "genre" : this.createBoxoffice.get('boxoffice_genre').value,
        "genre_type" : this.createBoxoffice.get('boxoffice_genre_type').value,
      }

      this.createNewBoxOffice(insertArr);

    }else{
      
    }
    
  }

  createNewBoxOffice(insertArr){

    this.superadminService.createNewBusiness(insertArr).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Box Office Created.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.dialogRef.close();
      }else if(response.data == false){
          
      }
    });

  }
  
}