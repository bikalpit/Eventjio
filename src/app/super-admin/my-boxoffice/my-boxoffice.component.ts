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

  ) { }

    ngOnInit(): void {
      this.getAllBoxoffice();
    }

    ngAfterViewInit() {
      setTimeout(() => {
        this.isLoaderAdmin = false;
      }, 4000);
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
     // this.router.navigate(['/admin/my-workspace']);

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
      event_run_type : ['', Validators.required],
    });

  }

  getAllCountry(){
    this.isLoaderAdmin = true;
    this.superadminService.getAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
      }
      this.isLoaderAdmin = false;
    });
  }
  
  getAllCurrancy(){

    this.isLoaderAdmin = true;
    this.superadminService.getAllCurrancy().subscribe((response:any) => {
      this.isLoaderAdmin = false;
      if(response.data == true){
        this.allCurency = response.response
      }else if(response.data == false && response.response == 'TOKEN_EXPIRED'){
          
      }
    });
    
  }


  fnCreateBoxOffice(){
    console.log(this.createBoxoffice.valid);

    if(this.createBoxoffice.valid){

      var insertArr = {
        "business_name" : this.createBoxoffice.get('boxoffice_name').value,
        "address" : this.createBoxoffice.get('boxoffice_type').value,
        "country" : this.createBoxoffice.get('boxoffice_country').value,
        "state" : this.createBoxoffice.get('boxoffice_billing_currency').value,
        "city" : this.createBoxoffice.get('boxoffice_genre').value,
        "time_zone" : this.createBoxoffice.get('event_run_type').value,
      }

      this.createNewBusiness(insertArr);
    }
    
  }

  createNewBusiness(insertArr){
    console.log(insertArr);
    // this.superadminService.createNewBusiness(insertArr).subscribe((response:any) => {
    //   if(response.data == true){
    //     this._snackBar.open("Box Office Created.", "X", {
    //       duration: 2000,
    //       verticalPosition:'top',
    //       panelClass :['green-snackbar']
    //     });
    //     this.dialogRef.close();
    //   }
    // });

  }
  
}