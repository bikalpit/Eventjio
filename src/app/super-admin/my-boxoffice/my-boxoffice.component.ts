import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SuperadminService } from '../_services/superadmin.service'
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
  isLoaderAdmin : boolean = true;
  currentUser:any;
  adminId:any;
  token:any;
  getIpAddress : any;
 
  constructor(

    public dialog: MatDialog,
    public router: Router,
    public superadminService : SuperadminService,

    ) {

      localStorage.setItem('isBoxoffice','true')
      console.log(this.allBoxoffice)
     }

    ngOnInit(): void {
      this.getAllBoxoffice();
    }

    ngAfterViewInit() {
    
    }

    getAllBoxoffice(){

      this.isLoaderAdmin = true;
      this.superadminService.getAllBoxoffice().subscribe((response:any) => {
        this.isLoaderAdmin = false;
        if(response.data == true){
          this.allBoxoffice = response.response
        }else if(response.data == false && response.response == 'TOKEN_EXPIRED'){

        }
      });

    }

  
    fnSelectBoxoffice(boxoffice_id,name){

      localStorage.setItem('boxoffice_id', boxoffice_id);
      localStorage.setItem('boxoffice_name', name);
      localStorage.setItem('isBoxoffice','true');
      this.router.navigate(['/super-admin/events']);

    }

    fnCreateBoxOffice() {
      const dialogRef = this.dialog.open(myCreateNewBoxofficeDialog, {
        width: '1100px',
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
  admin_id = localStorage.getItem('admin-id');

  constructor(
    public dialogRef: MatDialogRef<myCreateNewBoxofficeDialog>,
    public router: Router,
    private superadminService: SuperadminService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
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
      }else if(response.data == false && response.response == 'TOKEN_EXPIRED'){
          
      }
    });

  }


  fnCreateBoxOffice(){

    if(this.createBoxoffice.valid){

      var insertArr = {
        "box_office_name" : this.createBoxoffice.get('boxoffice_name').value,
        "admin_id" : this.admin_id,
        "type" : this.createBoxoffice.get('boxoffice_type').value,
        "currency" : this.createBoxoffice.get('boxoffice_billing_currency').value,
        "country" : this.createBoxoffice.get('boxoffice_billing_currency').value,
        "genre" : this.createBoxoffice.get('boxoffice_genre').value,
        "genre_type" : this.createBoxoffice.get('boxoffice_genre_type').value,
      }

      this.createNewBoxOffice(insertArr);

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
      }else if(response.data == false && response.response == 'TOKEN_EXPIRED'){
          
      }
    });

  }
  
}