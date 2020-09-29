import {Component, OnInit, ViewChild,Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuperadminService } from '../_services/superadmin.service';
import { ErrorService } from '../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: [DatePipe]
})
export class EventsComponent implements OnInit {
 
  isLoaderAdmin:boolean = false;
 redirectURL:any = 'N';
 hideEventSearch:any = 'N';
 customSalesTax:any = 'N';
 accessCode:any = 'N';
 donation:any = 'N';
 shareButtonStatus: any = 'N';
 olPlatForm : any = 'N';

 addNewEvents : boolean = true;
 public editorValue: string = '';
 addEventForm : FormGroup;
 eventStatus : FormGroup;
 allCountry:any;
 allTimeZone:any;
 boxOfficeCode:any;
 eventImageType:any = 'noImage';
 newEventImageUrl:any = '';
 allDefaultImages:any;
 selecetdDefaultImage:any;
 eventStartTime:any;
  // timeIntervals:any = ['00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'];
  allUpcomingEventListData:any =[];
  allPastEventListData:any =[];
  salesTax = [ ];
  salesTaxValue = [{
    amount:'',
    label:'',
  }];

  customSalesTaxForm: FormGroup;
  customSalesTaxArr: FormArray;
  minEventStartDate:any = new Date();
  minEventEndDate:any = new Date();
  eventTicketList= [];
  eventTicketAlertMSG :boolean = true;
  fullDayTimeSlote:any;
  startEndSameDate:boolean = false;
  assignedTicketId :any =[];
  // minEndTime:any;
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private router: Router,
    private SuperadminService: SuperadminService,
    ) {
      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');
      }
      this.salesTax.length = 1;

      this.addEventForm = this._formBuilder.group({
        event_name: ['',[Validators.required]],
        event_start_date: ['',Validators.required],
        event_start_time: ['',Validators.required],
        event_end_date: ['',Validators.required],
        event_end_time: ['',Validators.required],
        vanue_name: ['',Validators.required],
        vanue_zip: ['',Validators.required],
        vanue_country: ['',Validators.required],
        online_platform: [''],
        online_link: [''],
        description: ['',Validators.required],
        timezone: ['',Validators.required],
        donation_title: [''],
        donation_amount: [''],
        donation_description: [''],
        book_btn_title: ['',Validators.required],
        ticket_available: ['',Validators.required],
        ticket_unavailable: ['',Validators.required],
        redirect_url: [''],
        access_code: [''],
      });

      console.log(this.addEventForm.controls);

      this.customSalesTaxForm = this._formBuilder.group({
        customSalesTaxArr: this._formBuilder.array([this.createSalesTaxItem()])
      });

    }

   
  ngOnInit(): void {
    this.getAllCountry();
    this.getAllTimeZone();
    this.getDefaultImages();
    this.fnGetUpcomingEventList();
    this.fnGetPastEventList();
    this.getTimeSlote();
    
  }

  createSalesTaxItem() {
    return this._formBuilder.group({
      amount: [''],
      label: ['']
    })
  }

  
  fnSalesTaxAdd(){
    
    this.customSalesTaxArr = this.customSalesTaxForm.get('customSalesTaxArr') as FormArray;
    this.customSalesTaxArr.push(this.createSalesTaxItem());
    this.salesTax = this.customSalesTaxForm.value.customSalesTaxArr;
  }


  getAllCountry(){
    this.SuperadminService.getAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
      }
    });
  }

  getDefaultImages(){
    this.SuperadminService.getDefaultImages().subscribe((response:any) => {
      if(response.data == true){
        this.allDefaultImages= response.response
      }
    });
  }

  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SuperadminService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response
       // console.log(this.fullDayTimeSlote)
      }
    });
  }

  getAllTimeZone(){
    this.SuperadminService.getAllTimeZone().subscribe((response:any) => {
      if(response.data == true){
        this.allTimeZone = response.response
      }
    });
  }

  // List Event fns

  onTabChange(event){
    let clickedIndex = event.index;
    if(clickedIndex == 0){
      this.fnGetUpcomingEventList();
    }else if(clickedIndex == 1){
      this.fnGetPastEventList();
    }
  }


  fnGetUpcomingEventList(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id'  :this.boxOfficeCode,
      'filter' : 'upcoming'
    }
    this.isLoaderAdmin = true;
    this.SuperadminService.fnGetAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allUpcomingEventListData = response.response
        this.allUpcomingEventListData.forEach(element => {
          element.start_date =  this.datePipe.transform(new Date(element.start_date),"EEE MMM d, y")
        });
        this.addNewEvents = true;
      }else if(response.data == false){
        this.allUpcomingEventListData.length = 0;
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }

  fnGetPastEventList(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id'  :this.boxOfficeCode,
      'filter' : 'past'
    }
    this.isLoaderAdmin = true;
    this.SuperadminService.fnGetAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allPastEventListData = response.response
        this.allPastEventListData.forEach(element => {
          element.start_date =  this.datePipe.transform(element.start_date,"EEE MMM d, y")
        });
        this.addNewEvents = true;
      }else if(response.data == false){
        this.allPastEventListData.lenght = 0
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }

  fnSelectSingleEvent(eventCode){
    localStorage.setItem('selectedEventCode', eventCode);
    this.router.navigate(["/super-admin/single-event-dashboard/"]);
  }


  // add Event Fns
  
  fnChangeEventStartDate(){
    // this.minEventEndDate = this.addEventForm.get('event_start_date').value;
    // this.addEventForm.get('event_end_date').setValue('');
    // this.addEventForm.get('event_end_time').setValue('');
  }
  
  fnChangeEventEndDate(){
    // let startDate = this.addEventForm.get('event_start_date').value;
    // let endDate = this.addEventForm.get('event_end_date').value;
    // if(startDate == endDate){
    //   this.startEndSameDate = true;
    // }else{
    //   this.startEndSameDate = false;
    // }
    // this.minEventEndDate = this.addEventForm.get('event_start_date').value;
    // this.addEventForm.get('event_end_date').setValue('');
    // this.addEventForm.get('event_end_time').setValue('');
  }

  fnChangeStartTime(event){
   // this.eventStartTime = this.addEventForm.get('event_start_time').value;
  }

  fnChangeEventStatus(uniqueCode, status){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code' : uniqueCode,
      'event_status' : status,
    }
    this.SuperadminService.fnChangeEventStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }

  fnCancelNewEvent(){
    this.addNewEvents = true;
  }

  fnSelectImage(imageType){
    this.eventImageType = imageType
  }
  
  fnSelectDefaultImage(imageName){
    this.selecetdDefaultImage = imageName;
  }

  fnChangeDonation(event){
    if(event.checked == true){
      this.donation = 'Y' ;
      this.addEventForm.controls["donation_title"].setValidators(Validators.required);
      this.addEventForm.controls["donation_amount"].setValidators(Validators.required);
      this.addEventForm.controls["donation_description"].setValidators(Validators.required);
      this.addEventForm.controls["donation_title"].updateValueAndValidity();
      this.addEventForm.controls["donation_amount"].updateValueAndValidity();
      this.addEventForm.controls["donation_description"].updateValueAndValidity();
    }else{
      this.donation = 'N' 
      this.addEventForm.controls["donation_title"].setValidators(null);
      this.addEventForm.controls["donation_amount"].setValidators(null);
      this.addEventForm.controls["donation_description"].setValidators(null);
      this.addEventForm.controls["donation_title"].updateValueAndValidity();
      this.addEventForm.controls["donation_amount"].updateValueAndValidity();
      this.addEventForm.controls["donation_description"].updateValueAndValidity();
    }
    this.addEventForm.updateValueAndValidity();
  }

  fnRedirectURL(event){
    if(event.checked == true){
      this.redirectURL = 'Y' 
      this.addEventForm.controls["redirect_url"].setValidators(Validators.required);
      this.addEventForm.controls["redirect_url"].updateValueAndValidity();
    }else{
      this.redirectURL = 'N' 
      this.addEventForm.controls["redirect_url"].setValidators(null);
      this.addEventForm.controls["redirect_url"].updateValueAndValidity();
    }
    this.addEventForm.updateValueAndValidity();
  }

  fnAccessCode(event){
    if(event.checked == true){
      this.accessCode = 'Y' 
      this.addEventForm.controls["access_code"].setValidators(Validators.required);
      this.addEventForm.controls["access_code"].updateValueAndValidity();
  
    }else{
      this.accessCode = 'N' 
      this.addEventForm.controls["access_code"].setValidators(null);
      this.addEventForm.controls["access_code"].updateValueAndValidity();
    }
    this.addEventForm.updateValueAndValidity();
  }

  fnShareButtonStatus(event){
    if(event.checked == true){
      this.shareButtonStatus = 'Y' 
    }else{
      this.shareButtonStatus = 'N' 
    }
  }

  fnCustomSalesTax(event){
    if(event.checked == true){
      this.customSalesTax = 'Y' 
    }else{
      this.customSalesTax = 'N' 
    }
  }

  fnHideEventSearch(event){
    if(event.checked == true){
      this.hideEventSearch = 'Y' 
    }else{
      this.hideEventSearch = 'N' 
    }
  }
  
  fnolPlatform(event){
    if(event.checked == true){
      this.olPlatForm = 'Y';
      this.addEventForm.controls["online_platform"].setValidators(Validators.required);
      this.addEventForm.controls["vanue_name"].setValidators(null);
      this.addEventForm.controls["vanue_zip"].setValidators(null);
      this.addEventForm.controls["vanue_country"].setValidators(null);
      this.addEventForm.controls["online_platform"].updateValueAndValidity();
      this.addEventForm.controls["vanue_name"].updateValueAndValidity();
      this.addEventForm.controls["vanue_zip"].updateValueAndValidity();
      this.addEventForm.controls["vanue_country"].updateValueAndValidity();
    }else{
      this.olPlatForm = 'N';
      this.addEventForm.controls["online_platform"].setValidators(null);
      this.addEventForm.controls["vanue_name"].setValidators(Validators.required);
      this.addEventForm.controls["vanue_zip"].setValidators(Validators.required);
      this.addEventForm.controls["vanue_country"].setValidators(Validators.required);
      this.addEventForm.controls["online_platform"].updateValueAndValidity();
      this.addEventForm.controls["vanue_name"].updateValueAndValidity();
      this.addEventForm.controls["vanue_zip"].updateValueAndValidity();
      this.addEventForm.controls["vanue_country"].updateValueAndValidity();
    }
    this.addEventForm.updateValueAndValidity();
  }
  
  fnAddNewEvent(){
    console.log(this.addEventForm)
    console.log(this.salesTax)
    this.customSalesTaxArr = this.customSalesTaxForm.get('customSalesTaxArr') as FormArray;
    // this.customSalesTaxArr.push(this.createSalesTaxItem());
    this.salesTax = this.customSalesTaxForm.value.customSalesTaxArr;

    if(this.addEventForm.invalid){
      this.addEventForm.get('event_name').markAsTouched();
      this.addEventForm.get('event_start_date').markAsTouched();
      this.addEventForm.get('event_start_time').markAsTouched();
      this.addEventForm.get('event_end_date').markAsTouched();
      this.addEventForm.get('event_end_time').markAsTouched();
      this.addEventForm.get('description').markAsTouched();
      this.addEventForm.get('timezone').markAsTouched();
      this.addEventForm.get('book_btn_title').markAsTouched();
      this.addEventForm.get('ticket_available').markAsTouched();
      this.addEventForm.get('ticket_unavailable').markAsTouched();
      this.addEventForm.get('donation_title').markAsTouched();
      this.addEventForm.get('donation_amount').markAsTouched();
      this.addEventForm.get('donation_description').markAsTouched();
      this.addEventForm.get('redirect_url').markAsTouched();
      this.addEventForm.get('access_code').markAsTouched();
      this.addEventForm.get('vanue_name').markAsTouched();
      this.addEventForm.get('vanue_zip').markAsTouched();
      this.addEventForm.get('vanue_country').markAsTouched();
      return false;
     }



     let requestObject = {
      'boxoffice_id':this.boxOfficeCode,
      'event_title':this.addEventForm.get('event_name').value,
      'start_date':this.datePipe.transform(new Date(this.addEventForm.get('event_start_date').value),"yyyy-MM-dd"),
      'end_date': this.datePipe.transform(new Date(this.addEventForm.get('event_end_date').value),"yyyy-MM-dd"),
      'start_time':this.addEventForm.get('event_start_time').value,
      'end_time':this.addEventForm.get('event_end_time').value,
      'venue_name':this.addEventForm.get('vanue_name').value,
      'postal_code':this.addEventForm.get('vanue_zip').value,
      'country':this.addEventForm.get('vanue_country').value,
      'online_event':this.olPlatForm,
      'description':this.addEventForm.get('description').value,
      'platform':this.addEventForm.get('online_platform').value,
      'event_link':this.addEventForm.get('online_link').value,
      'event_status':'draft',
      'timezone':this.addEventForm.get('timezone').value,
      'make_donation':this.donation,
      'event_button_title':this.addEventForm.get('book_btn_title').value,
      'donation_title':this.addEventForm.get('donation_title').value,
      'donation_amt':this.addEventForm.get('donation_amount').value,
      'donation_description':this.addEventForm.get('donation_description').value,
      'ticket_avilable':this.addEventForm.get('ticket_available').value,
      'ticket_unavilable':this.addEventForm.get('ticket_unavailable').value,
      'redirect_confirm_page':this.redirectURL,
      'redirect_url':this.addEventForm.get('redirect_url').value,
      'hide_office_listing':this.hideEventSearch,
      'customer_access_code':this.accessCode,
      'access_code':this.addEventForm.get('access_code').value,
      'hide_share_button':this.shareButtonStatus,
      'custom_sales_tax':this.customSalesTax,
      'sales_tax':this.salesTax,
      'ticket_ids':this.assignedTicketId,
      'image' : this.newEventImageUrl,
      'default-image' : this.selecetdDefaultImage,
      };
      this.createNewEvent(requestObject);
  }

  createNewEvent(requestObject){
    this.isLoaderAdmin = true;
    this.SuperadminService.createNewEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.fnGetUpcomingEventList()
        this.fnGetPastEventList()
        this.addNewEvents = true;
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;

  }




  
  
  openAddNewTicketTypeDialog() {
    const dialogRef = this.dialog.open(AddNewTicketType,{
      width: '1100px',
      data : {
        boxOfficeCode : this.boxOfficeCode,
        fullDayTimeSlote : this.fullDayTimeSlote,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.eventTicketList.push(result)
        console.log(this.eventTicketList)
        this.assignedTicketId.push(result.id)
        console.log(this.assignedTicketId)
        this.eventTicketAlertMSG = false;
      }
    });
  }

  openAddNewTicketGroupDialog() {
    const dialogRef = this.dialog.open(AddNewTicketGroup,{
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  fnUploadEventImage(){
    const dialogRef = this.dialog.open(DialogEventImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.newEventImageUrl = result;
            console.log(result);
           }
     });
  }

}



@Component({
  selector: 'profile-image-upload',
  templateUrl: '../_dialogs/image-upload.html',
})
export class DialogEventImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogEventImageUpload>,
  private _formBuilder:FormBuilder,
  @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadForm.patchValue({
              fileSource: reader.result
          });
      };
  }
}
uploadImage() {
  this.profileImage = this.imageSrc
  this.dialogRef.close(this.profileImage);
}


}


@Component({
  selector: 'add-new-ticket-type',
  templateUrl: '../_dialogs/add-new-ticket-type.html',
  providers: [DatePipe]
})
export class AddNewTicketType {
  isLoaderAdmin:boolean = false;
  allCouponCodeList:any;
  boxOfficeCode:any
  addTicketForm:FormGroup;
  minDate= new Date();
  assignedCouponCodes :any = [];
  showQTY:any = 'N';
  soldOut:any = 'N';
  showDes:any = 'N';
  fullDayTimeSlote:any;
  constructor(
    public dialogRef: MatDialogRef<AddNewTicketType>,
    private _formBuilder: FormBuilder,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private SuperadminService: SuperadminService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode
      this.fullDayTimeSlote = this.data.fullDayTimeSlote

      this.addTicketForm = this._formBuilder.group({
        title: ['',[Validators.required]],
        price: ['',[Validators.required]],
        qty: ['',[Validators.required]],
        description: ['',[Validators.required]],
        fee: [''],
        status: ['',[Validators.required]],
        min_order: ['',[Validators.required]],
        max_order: ['',[Validators.required]],
        until_date: ['',[Validators.required]],
        until_time: ['',[Validators.required]],
        until_interval: ['',[Validators.required]],
        after_date: ['',[Validators.required]],
        after_time: ['',[Validators.required]],
        after_interval: ['',[Validators.required]]
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.getAllCouponCodes();
  }

  getAllCouponCodes(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'search':'',
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SuperadminService.getAllCouponCodes(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.allCouponCodeList = response.response
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      this.allCouponCodeList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

  fnAddCoupon(event, couponCode){
    if(event.checked == true){
      this.assignedCouponCodes.push(couponCode)
    }else{
      const index = this.assignedCouponCodes.indexOf(couponCode, 0);
      if (index > -1) {
          this.assignedCouponCodes.splice(index, 1);
      }
    }
  }

  fnChangeShowQTY(event){
    if(event.checked == true){
      this.showQTY = 'Y';
    }else{
      this.showQTY = 'N';
    }
  }

  fnChangeSoldOut(event){
    if(event.checked == true){
      this.soldOut = 'Y';
    }else{
      this.soldOut = 'N';
    }
  }


  fnSubmitAddTicketForm(){
    if(this.addTicketForm.invalid){
      
      this.addTicketForm.get('title').markAsTouched;
      this.addTicketForm.get('price').markAsTouched;
      this.addTicketForm.get('qty').markAsTouched;
      this.addTicketForm.get('description').markAsTouched;
      this.addTicketForm.get('fee').markAsTouched;
      this.addTicketForm.get('status').markAsTouched;
      this.addTicketForm.get('min_order').markAsTouched;
      this.addTicketForm.get('max_order').markAsTouched;
      this.addTicketForm.get('until_date').markAsTouched;
      this.addTicketForm.get('until_time').markAsTouched;
      this.addTicketForm.get('after_date').markAsTouched;
      this.addTicketForm.get('after_time').markAsTouched;
      this.addTicketForm.get('until_interval').markAsTouched;
      this.addTicketForm.get('after_interval').markAsTouched;

      return false;
    }

    let requestObject = {
      'box_office_id': this.boxOfficeCode,
      'ticket_name': this.addTicketForm.get('title').value,
      'prize': this.addTicketForm.get('price').value,
      'qty': this.addTicketForm.get('qty').value,
      'advance_setting': 'Y',
      'description':  this.addTicketForm.get('description').value,
      'booking_fee':  this.addTicketForm.get('fee').value,
      'status':  this.addTicketForm.get('status').value,
      'min_per_order':  this.addTicketForm.get('min_order').value,
      'max_per_order':this.addTicketForm.get('max_order').value,
      'hide_untill': 'Y',
      'hide_after':  'Y',
      'untill_date': this.datePipe.transform(new Date(this.addTicketForm.get('until_date').value),"yyyy-MM-dd"),
      'untill_time': this.addTicketForm.get('until_time').value,
      'after_date':  this.datePipe.transform(new Date(this.addTicketForm.get('after_date').value),"yyyy-MM-dd"),
      'after_time':  this.addTicketForm.get('after_time').value,
      'sold_out':  this.soldOut,
      'show_qty':  this.showQTY,
      'discount':  this.assignedCouponCodes,
      'untill_interval':  this.addTicketForm.get('until_interval').value,
      'after_interval':  this.addTicketForm.get('after_interval').value,
    }
    
    this.createNewTicket(requestObject)
    console.log(this.addTicketForm)
  }


  createNewTicket(requestObject){
    this.isLoaderAdmin = true;
    this.SuperadminService.createNewTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){

        this.ErrorService.successMessage('Ticket created succesfully.');
        this.dialogRef.close(response.response);
      }
      else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    })
  }
 
}


@Component({
  selector: 'add-new-ticket-group',
  templateUrl: '../_dialogs/add-new-ticket-group.html',
  providers: [DatePipe]
})
export class AddNewTicketGroup {
  constructor(
    public dialogRef: MatDialogRef<AddNewTicketGroup>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}