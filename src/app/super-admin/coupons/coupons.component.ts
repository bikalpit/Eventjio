import { Component, OnInit ,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe} from '@angular/common';
import { SuperadminService } from '../_services/superadmin.service';
import { ErrorService } from '../../_services/error.service'
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
  providers: [DatePipe]
})
export class CouponsComponent implements OnInit {
  isLoaderAdmin:boolean = false;
  animal :any;
  clickedIndex:any = 'coupon'
  boxOfficeCode:any;
  allCouponCodeList:any;
  constructor(
   public dialog: MatDialog,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private ErrorService: ErrorService,
    private SuperadminService : SuperadminService,
 ) {
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }
  }


 ngOnInit(): void {
   this.getAllCouponCodes();
 }
 
 onTabChanged(event){
   let clickedIndex = event.index;
   if(clickedIndex == 0){
   this.clickedIndex = 'coupon'
   }else if(clickedIndex == 1){
   this.clickedIndex = 'voucher'
   }
 }

 getAllCouponCodes(){
  this.isLoaderAdmin = true;
  let requestObject = {
    'boxoffice_id' : this.boxOfficeCode
  }
  this.SuperadminService.getAllCouponCodes(requestObject).subscribe((response:any) => {
    if(response.data == true){
     this.allCouponCodeList = response.response
     console.log(this.allCouponCodeList)
    }
    else if(response.data == false){
     this.ErrorService.errorMessage(response.response);
    }
    this.isLoaderAdmin = false;
  })
}

 creatDiscountCode() {
   const dialogRef = this.dialog.open(myCreateDiscountCodeDialog, {
     width: '1100px',
     data :{boxOfficeCode : this.boxOfficeCode}
   });

    dialogRef.afterClosed().subscribe(result => {
     this.animal = result;
     this.getAllCouponCodes();
    });
 }

 creatVoucherCode() {
  const dialogRef = this.dialog.open(myBatchVoucherCodeDialog, {
    width: '550px',
    data :{boxOfficeCode : this.boxOfficeCode}
  });

   dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
   });
}

}

@Component({
  selector: 'Create-Discount-Code',
  templateUrl: '../_dialogs/create-discount-code-dialog.html',
  providers: [DatePipe]
})
export class myCreateDiscountCodeDialog { 
  isLoaderAdmin:boolean = false;
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  createCouponForm: FormGroup;
  minDate = new Date();
  minTillDate : any = new Date();
  diccount_error:boolean=false;
  boxOfficeCode:any;
  constructor(
    public dialogRef: MatDialogRef<myCreateDiscountCodeDialog>,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private SuperadminService : SuperadminService,
    private ErrorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.createCouponForm = this._formBuilder.group({
      title : ['', [Validators.required,Validators.maxLength(15)]],
      max_redemption : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
      code : ['', [Validators.required,Validators.maxLength(15)]],
      valid_from : ['', Validators.required],
      type : ['', Validators.required],
      valid_till : ['', Validators.required],
      discount : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
    });

  }

  discount_check(){

    var discount_type = this.createCouponForm.get('type').value;
    var discount_value = this.createCouponForm.get('discount').value; 

    if(discount_type=='P' && discount_value > 100){
      this.diccount_error = true;
    }else{
      this.diccount_error = false;
    }
  }

  fnChangeValideFrom(){
    this.minTillDate =this.createCouponForm.get('valid_from').value;
    console.log(this.createCouponForm)
    this.createCouponForm.get('valid_till').setValue('');
  }

  fnSubmitCreateCoupon(){
    if(this.createCouponForm.valid){
       let valid_from = this.createCouponForm.get('valid_from').value;
      let valid_till = this.createCouponForm.get('valid_till').value;

      if(valid_from > valid_till){
        this._snackBar.open("Please select valid till date.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
        return;
      }
      
      
      valid_from=this.datePipe.transform(new Date(valid_from),"yyyy-MM-dd")
      valid_till=this.datePipe.transform(new Date(valid_till),"yyyy-MM-dd")

      var discount_type = this.createCouponForm.get('type').value;
      var discount_value = this.createCouponForm.get('discount').value; 
      if(discount_type=='P' && discount_value > 100){
        this.diccount_error = true;
        return;
      }else{
        this.diccount_error = false;
      }

      let createdCouponCodeData = {
        "boxoffice_id" : this.boxOfficeCode,
        "coupon_title" : this.createCouponForm.get('title').value,
        "coupon_code" : this.createCouponForm.get('code').value,
        "max_redemption" : this.createCouponForm.get('max_redemption').value,
        "valid_from" : valid_from,
        "valid_till" : valid_till,
        "discount_type" : this.createCouponForm.get('type').value,
        "discount" : this.createCouponForm.get('discount').value,
      }
        this.createNewCouponCode(createdCouponCodeData);
     
    }else{
      this.createCouponForm.get("title").markAsTouched();
      this.createCouponForm.get("code").markAsTouched();
      this.createCouponForm.get("max_redemption").markAsTouched();
      this.createCouponForm.get("type").markAsTouched();
      this.createCouponForm.get('valid_from').markAsTouched()
      this.createCouponForm.get('valid_till').markAsTouched()
      this.createCouponForm.get("discount").markAsTouched();
    }
  }
  createNewCouponCode(createdCouponCodeData){
    this.isLoaderAdmin = true;
    this.SuperadminService.createNewCouponCode(createdCouponCodeData).subscribe((response:any) => {
      if(response.data == true){
       this.ErrorService.successMessage(response.response);
        this.createCouponForm.reset();
        this.dialogRef.close();
      }
      else if(response.data == false){
       this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    })
  }
  fnCancelCreateCoupon(){
    this.dialogRef.close();
  }
  
}

@Component({
  selector: 'Create-Voucher-Code',
  templateUrl: '../_dialogs/create-voucher-code-dialog.html',
})
export class myBatchVoucherCodeDialog { 
  boxOfficeCode:any;
  constructor(
    public dialogRef: MatDialogRef<myBatchVoucherCodeDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  
}



