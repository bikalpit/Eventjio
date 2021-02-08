import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router, RouterEvent, RouterOutlet,ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SuperadminService } from '../_services/superadmin.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ErrorService } from '../../_services/error.service';
import { AppComponent } from '../../app.component'
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
  pageSlug:any;
 
  constructor(

    public dialog: MatDialog,
    public router: Router,
    public superadminService : SuperadminService,
    private authenticationService : AuthenticationService,
    private ErrorService : ErrorService,
    public AppComponent: AppComponent
    ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      localStorage.setItem('isBoxoffice','true')
      this.router.events.subscribe(event => {
        if (event instanceof RouterEvent) this.handleRoute(event);
          const url = this.getUrl(event);
      });
     }

    ngOnInit(): void {

      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

       if(this.currentUser.type == 'member'){

          localStorage.setItem('isBoxoffice','false');

          if(this.currentUser.permission != 'A'){
            if(localStorage.getItem('permision_EM')  == 'TRUE'){
              this.router.navigate(['/super-admin/events']);
            } else if(localStorage.getItem('permision_OM')  == 'TRUE'){
              this.router.navigate(['/super-admin/orders']);
            }else if(localStorage.getItem('permision_OV')  == 'TRUE'){
              this.router.navigate(['/super-admin/dashboard']);
            }

          }else if(this.currentUser.permission == 'A'){
            this.router.navigate(['/super-admin/dashboard']);
          }
      }
 
      
      this.getAllBoxoffice();
    }

    ngAfterViewInit() {
      
    }

    getAllBoxoffice(){
      this.isLoaderAdmin = true;
      let requestObject = {
          'admin_id' : this.currentUser.user_id,
      };
      this.superadminService.getAllBoxoffice(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.allBoxoffice = response.response
        }else if(response.data == false){
          // this.ErrorService.errorMessage(response.response)
        }
      });
      this.isLoaderAdmin = false;

    }

  
    fnSelectBoxoffice(boxoffice_code,name,link){

      localStorage.setItem('boxoffice_id', boxoffice_code);
      if(link){
        localStorage.setItem('boxoffice_link', link);
      }
      localStorage.setItem('boxoffice_name', name);
      localStorage.setItem('isBoxoffice','false');
      this.router.navigate(['/super-admin/dashboard']);

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

    
  // page url conditions
  dynamicSort(property: string) {
    let sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return (a, b) => {
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }
  private getUrl(event: any) {
    if (event && event.url) {
      this.pageSlug = event.url.split('/' , 2)
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    let devidedUrl = url.split('/',4);
    console.log(devidedUrl)
    if((devidedUrl[1] == 'super-admin' && devidedUrl.length == 2) || devidedUrl[2] == 'boxoffice'){
      console.log('boxoffice yes')
      // this.AppComponent
      localStorage.setItem('isBoxoffice','true');
    }else{
      console.log('boxoffice no')
      localStorage.setItem('isBoxoffice','false');
    }
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
    private ErrorService: ErrorService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.admin_id = this.data.adminId;
      this.getAllCountry();
      this.getAllCurrancy();
    }

  onNoClick(): void {
    this.createBoxoffice.reset();
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
        this.ErrorService.errorMessage(response.response)
      }
    });

  }


  fnCreateBoxOffice(){
    if(this.createBoxoffice.invalid){
      this.createBoxoffice.get('boxoffice_name').markAsTouched();
      this.createBoxoffice.get('boxoffice_type').markAsTouched();
      this.createBoxoffice.get('boxoffice_billing_currency').markAsTouched();
      this.createBoxoffice.get('boxoffice_country').markAsTouched();
      this.createBoxoffice.get('boxoffice_genre').markAsTouched();
      this.createBoxoffice.get('boxoffice_genre_type').markAsTouched();
      return false;
    }else if(this.createBoxoffice.valid){

      var insertArr = {
        "admin_id": this.admin_id,
        "box_office_name" : this.createBoxoffice.get('boxoffice_name').value,
        "type" : this.createBoxoffice.get('boxoffice_type').value,
        "currency" : this.createBoxoffice.get('boxoffice_billing_currency').value,
        "country" : this.createBoxoffice.get('boxoffice_country').value,
        "genre" : this.createBoxoffice.get('boxoffice_genre').value,
        "genre_type" : this.createBoxoffice.get('boxoffice_genre_type').value,
      }

      this.createNewBoxOffice(insertArr);

    }
    
  }

  createNewBoxOffice(insertArr){

    this.isLoaderAdmin = true;
    this.superadminService.createNewBusiness(insertArr).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.createBoxoffice.reset();
        this.dialogRef.close();
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    this.isLoaderAdmin = false;
  }
  
}