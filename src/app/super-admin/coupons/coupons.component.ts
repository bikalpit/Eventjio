import { Component, OnInit ,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe} from '@angular/common';
 import { ErrorService } from '../../_services/error.service'
 import { SuperadminService} from '../_services/superadmin.service';
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
  clickedIndex: any = 'coupon'
  boxOfficeCode: any;
  allCouponCodeList: any = [];
  allVoucherCodeList:any = [];
  couponCodeStatus: any;
  signleCouponDetail: any;
  signleVoucherDetail :  any;
  search = {
    keyword: ""
  };
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
   this.getAllVoucherCodes();
 }
 
  onTabChanged(event){
    let clickedIndex = event.index;
    if(clickedIndex == 0){
      this.clickedIndex = 'coupon'
    }else if(clickedIndex == 1){
      this.clickedIndex = 'voucher'
    }
    this.search.keyword = '';
    this.getAllVoucherCodes()
    this.getAllCouponCodes()
  }

 couponSearch(){
   if(this.clickedIndex == 'coupon'){
      this.getAllCouponCodes()
   }else if(this.clickedIndex == 'voucher'){
      this.getAllVoucherCodes()
   }
 }

  getAllCouponCodes(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'search':this.search.keyword,
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SuperadminService.getAllCouponCodes(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allCouponCodeList = response.response
      }
      else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        this.allCouponCodeList.length = 0
      // this.allCouponCodeList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

  getAllVoucherCodes(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'search':this.search.keyword,
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SuperadminService.getAllVoucherCodes(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this. allVoucherCodeList = response.response
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      this.allVoucherCodeList.length = 0
      // this. allVoucherCodeList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

  changeCouponStaus(event,couponcode_code){
    this.isLoaderAdmin = true;
    if(event.checked == true){
      this.couponCodeStatus = 'A';
    }
    else if(event.checked == false){
      this.couponCodeStatus = 'IA';
    }
    let requestObject = {
      'unique_code': couponcode_code,
      'status' : this.couponCodeStatus
    }
    this.SuperadminService.changeCouponStaus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
         this.getAllCouponCodes();
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;
  }
  fnDeleteCoupon(couponcode_code){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code': couponcode_code
    }
    this.SuperadminService.fnDeleteCoupon(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
         this.getAllCouponCodes();
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;
  }

  fnDeleteVoucher(vouchercode_code){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code': vouchercode_code
    }
    this.SuperadminService.fnDeleteVoucher(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
         this. getAllVoucherCodes();
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;
  }
  
  fnEditCoupon(couponcode_code){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code': couponcode_code
    }
    this.SuperadminService.fnGetSignleCouponDetail(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.signleCouponDetail = response.response[0];
        console.log(this.signleCouponDetail)
        this.creatDiscountCode();
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;

  }

  fnEditVoucher(vouchercode_code){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code': vouchercode_code
    }
    this.SuperadminService.fnGetSignleVoucherDetail(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.signleVoucherDetail = response.response[0];
        console.log(this.signleVoucherDetail)
        this.creatVoucherCode();
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;

  }

  

 creatDiscountCode() {
   this.isLoaderAdmin = true;
   const dialogRef = this.dialog.open(myCreateDiscountCodeDialog, {
     width: '1100px',
     data :{
       boxOfficeCode : this.boxOfficeCode,
       signleCouponDetail : this.signleCouponDetail
      }
   });

    dialogRef.afterClosed().subscribe(result => {
     this.animal = result;
     this.signleCouponDetail = null;
     this.getAllCouponCodes();
    });
    this.isLoaderAdmin = false;
 }

 creatVoucherCode() {
  const dialogRef = this.dialog.open(myBatchVoucherCodeDialog, {
    width: '550px',
    data :{boxOfficeCode : this.boxOfficeCode,
    signleVoucherDetail : this.signleVoucherDetail
  }
  });

   dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
    this.signleVoucherDetail = null
    this.getAllVoucherCodes();
   });
   this.isLoaderAdmin = false;
}

assignToEvent() {
  const dialogRef = this.dialog.open(AssignToEventDialog, {
    width: '550px',
    data :{boxOfficeCode : this.boxOfficeCode,}
  });

   dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
   });
   this.isLoaderAdmin = false;
}

assignToTicketType() {
  const dialogRef = this.dialog.open(AssignToTicketTypeDialog, {
    width: '550px',
    data :{boxOfficeCode : this.boxOfficeCode,}
  });

   dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
   });
   this.isLoaderAdmin = false;
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
  signleCouponDetail:any;
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
      this.signleCouponDetail = this.data.signleCouponDetail;

      this.createCouponForm = this._formBuilder.group({
        title : ['', [Validators.required,Validators.maxLength(15)]],
        max_redemption : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
        code : ['', [Validators.required,Validators.maxLength(15)]],
        valid_from : ['', Validators.required],
        type : ['', Validators.required],
        valid_till : ['', Validators.required],
        discount : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
      });

      if(this.signleCouponDetail){
        this.createCouponForm.controls['title'].setValue(this.signleCouponDetail.coupon_title)
        this.createCouponForm.controls['max_redemption'].setValue(this.signleCouponDetail.max_redemption)
        this.createCouponForm.controls['code'].setValue(this.signleCouponDetail.coupon_code)
        this.createCouponForm.controls['valid_from'].setValue(this.signleCouponDetail.valid_from)
        this.createCouponForm.controls['type'].setValue(this.signleCouponDetail.discount_type)
        this.createCouponForm.controls['valid_till'].setValue(this.signleCouponDetail.valid_till)
        this.createCouponForm.controls['discount'].setValue(this.signleCouponDetail.discount)
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
    
  }
  ngOnInit() {
   

  }

  fnChangeDiscountType(discountType){
    var discount_value = this.createCouponForm.get('discount').value; 
    if(discountType=='P' && discount_value > 100){
      this.diccount_error = true;
    }else{
      this.diccount_error = false;
    }
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
      if(this.signleCouponDetail){
        let updateCouponCodeData = {
          'unique_code': this.signleCouponDetail.unique_code,
          "boxoffice_id" : this.boxOfficeCode,
          "coupon_title" : this.createCouponForm.get('title').value,
          "coupon_code" : this.createCouponForm.get('code').value,
          "max_redemption" : this.createCouponForm.get('max_redemption').value,
          "valid_from" : valid_from,
          "valid_till" : valid_till,
          "discount_type" : this.createCouponForm.get('type').value,
          "discount" : this.createCouponForm.get('discount').value,
        }
          this.updateCouponCode(updateCouponCodeData);
          
      }else{
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
      }
     
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
  updateCouponCode(updateCouponCode){
    this.isLoaderAdmin = true;
    this.SuperadminService.updateCouponCode(updateCouponCode).subscribe((response:any) => {
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
  providers: [DatePipe]
})
export class myBatchVoucherCodeDialog { 
  isLoaderAdmin:boolean = false;
  boxOfficeCode:any;
  eventId:any;
  signleVoucherDetail:any;
  createVoucherForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    // private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private SuperadminService : SuperadminService,
    private ErrorService: ErrorService,
    public dialogRef: MatDialogRef<myBatchVoucherCodeDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode
      this.signleVoucherDetail = this.data.signleVoucherDetail

      this.createVoucherForm = this._formBuilder.group({
        voucher_name:['',[Validators.required,Validators.maxLength(15)]],
        voucher_value:['',[Validators.required,Validators.maxLength(15)]],
        voucher_code:['',[Validators.required,Validators.maxLength(15)]],
        expiry_date:['' ,Validators.required],
      })

      if(this.signleVoucherDetail){
        this.createVoucherForm.controls['voucher_name'].setValue(this.signleVoucherDetail.voucher_name)
        this.createVoucherForm.controls['voucher_value'].setValue(this.signleVoucherDetail.voucher_value)
        this.createVoucherForm.controls['voucher_code'].setValue(this.signleVoucherDetail.voucher_code)
        this.createVoucherForm.controls['expiry_date'].setValue(this.signleVoucherDetail.expiry_date)
      }

    }

    fnOnSubmitVoucher(){
      if(this.createVoucherForm.valid){
        if(this.signleVoucherDetail){

         let  expiry_date=this.datePipe.transform(new Date(this.createVoucherForm.get('expiry_date').value),"yyyy-MM-dd")
          let updateVoucherCode = {
            'unique_code': this.signleVoucherDetail.unique_code,
            "boxoffice_id" : this.boxOfficeCode,
            "voucher_name" : this.createVoucherForm.get('voucher_name').value,
            "voucher_value" : this.createVoucherForm.get('voucher_value').value,
            "voucher_code" : this.createVoucherForm.get('voucher_code').value,
            "expiry_date" : expiry_date,
          }
            this.updateVoucherCode(updateVoucherCode);
            
        }else{
          let  expiry_date=this.datePipe.transform(new Date(this.createVoucherForm.get('expiry_date').value),"yyyy-MM-dd")
          let createdVoucherCodeData = {
          "boxoffice_id" : this.boxOfficeCode,
          "voucher_name" : this.createVoucherForm.get('voucher_name').value,
          "voucher_value" : this.createVoucherForm.get('voucher_value').value,
          "voucher_code" : this.createVoucherForm.get('voucher_code').value,
          "expiry_date" : expiry_date,
          // "event_id" : this.eventId, 
        }
        this.createVoucherCode(createdVoucherCodeData);
        
        // console.log(this.createVoucherCode(createdVoucherCodeData))
      }
  
      }else{
        this.createVoucherForm.get("voucher_name").markAsTouched();
        this.createVoucherForm.get("voucher_value").markAsTouched();
        this.createVoucherForm.get("voucher_code").markAsTouched();
        this.createVoucherForm.get("expiry_date").markAsTouched();
      }
    
    }
    createVoucherCode(createdVoucherCodeData){
      this.isLoaderAdmin = true;
      this.SuperadminService.createVoucherCode(createdVoucherCodeData).subscribe((response:any) => {
        if(response.data == true){
         this.ErrorService.successMessage(response.response);
          this.createVoucherForm.reset();
          this.dialogRef.close();
        }
        else if(response.data == false){
         this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
        this.createVoucherForm.reset();
      })
    }

    updateVoucherCode(updateVoucherCode){
      this.isLoaderAdmin = true;
      this.SuperadminService.updateVoucherCode(updateVoucherCode).subscribe((response:any) => {
        if(response.data == true){
         this.ErrorService.successMessage(response.response);
          this.createVoucherForm.reset();
          this.dialogRef.close();
        }
        else if(response.data == false){
         this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
        this.createVoucherForm.reset();
      })
    }

  onNoClick(): void {
   
    this.createVoucherForm.reset();
    this.signleVoucherDetail = null;
    this.dialogRef.close();
  }
  ngOnInit() { 
  }
  
}


// ------------------------------------ Assign to Event -------------------------------------------

@Component({
  selector: 'Assign-To-Event-Dialog',
  templateUrl: '../_dialogs/assign-to-event-dialog.html',
})
export class AssignToEventDialog { 
  isLoaderAdmin:any;
  boxOfficeCode:any;
  getAllEventList:any;
  
  constructor(
    public dialogRef: MatDialogRef<AssignToEventDialog>,
    private SuperadminService : SuperadminService,
    private ErrorService:ErrorService,
  ) {
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }
  } 

  getAllEvent(){
    this.isLoaderAdmin = true;
    let requestObject = {
      // 'search':this.search.keyword,
      'filter' : 'upcoming',
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SuperadminService.fnGetAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this. getAllEventList = response.response
      // console.log(this.getAllEventList);
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      this. getAllEventList = null;
      }
      this.isLoaderAdmin = false;
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() { 
    this.getAllEvent();
  }
  
}


// ------------------------------------ Assign to Ticket Type --------------------------------------


@Component({
  selector: 'Assign-To-Ticket-type-Dialog',
  templateUrl: '../_dialogs/assign-to-ticket-type-dialog.html',
})
export class AssignToTicketTypeDialog { 
  isLoaderAdmin:any;
  boxOfficeCode:any;
  allticketType:any;
   constructor(
    public dialogRef: MatDialogRef<AssignToTicketTypeDialog>,
    private SuperadminService:SuperadminService,
    private ErrorService:ErrorService
  ){
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }
  } 

  getAllTicket(){
    this.isLoaderAdmin = true;
    let requestObject = {
      // 'search':this.search.keyword,
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SuperadminService.getAllTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this. allticketType = response.response
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      this. allticketType = null;
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