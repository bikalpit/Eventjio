import { Component, OnInit, Inject } from '@angular/core';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { element } from 'protractor';

@Component({
  selector: 'app-event-and-ticket-types',
  templateUrl: './event-and-ticket-types.component.html',
  styleUrls: ['./event-and-ticket-types.component.scss'],
  providers: [DatePipe]
})
export class EventAndTicketTypesComponent implements OnInit {
  value = 50;
  bufferValue = 75;
  salesTax = [ ];
  salesTaxVal = [];
  selectedEvent : any;
  boxOfficeCode : any;
  singleEventDetail:any;
  singleEventSetting:any;
  singleEventTickets:any;
  allCountry:any;
  allTimeZone:any;
  allDefaultImages:any;
  fullDayTimeSlote:any;
  editEventForm:FormGroup;
  customSalesTaxForm: FormGroup;
  customSalesTaxArr: FormArray;
  eventImageType:any = 'noImage';
  selecetdDefaultImage:any;
  isLoaderAdmin:boolean = false;
  redirectURL:any = 'N';
  hideEventSearch:any = 'N';
  customSalesTax:any = 'N';
  accessCode:any = 'N';
  donation:any = 'N';
  shareButtonStatus: any = 'N';
  olPlatForm : any = 'N';
  eventStartTime:any;
  minEventStartDate:any = new Date();
  minEventEndDate:any = new Date();
  startEndSameDate:boolean = false;
  eventTicketAlertMSG :boolean = true;
  eventTicketList= [];
  newEventImageUrl :any;
  selectedTicketDetail:any;

  constructor(
    private SingleEventServiceService: SingleEventServiceService,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private router: Router,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { 
    
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }
    if(localStorage.getItem('selectedEventCode')){
      this.selectedEvent = localStorage.getItem('selectedEventCode')
    }
    

      this.editEventForm = this._formBuilder.group({
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
      this.customSalesTaxForm = this._formBuilder.group({
        customSalesTaxArr: this._formBuilder.array([this.createSalesTaxItem()])
      });
  }

  ngOnInit(): void {
    this.getSingleEvent();
    this.getAllCountry();
    this.getAllTimeZone();
    this.getDefaultImages();
    this.getTimeSlote();

  }

  createSalesTaxItem(amount=null, label=null) {
    return this._formBuilder.group({
      amount: [amount],
      label: [label]
    })
  }

  

  fnSalesTaxAdd(){
    this.customSalesTaxArr = this.customSalesTaxForm.get('customSalesTaxArr') as FormArray;
    this.customSalesTaxArr.push(this.createSalesTaxItem());
    this.salesTax = this.customSalesTaxForm.value.customSalesTaxArr;
  }

  
  getAllCountry(){
    this.SingleEventServiceService.getAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
      }
    });
  }

  getDefaultImages(){
    this.SingleEventServiceService.getDefaultImages().subscribe((response:any) => {
      if(response.data == true){
        this.allDefaultImages= response.response
      }
    });
  }

  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response
      }
    });
  }

  getAllTimeZone(){
    this.SingleEventServiceService.getAllTimeZone().subscribe((response:any) => {
      if(response.data == true){
        this.allTimeZone = response.response
      }
    });
  }

  getSingleEvent(){
    let requestObject = {
      'unique_code'  :this.selectedEvent,
    }
    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.singleEventDetail= response.response.event[0];
        this.singleEventSetting= this.singleEventDetail.event_setting;
        this.eventTicketList= response.response.tickets;
        if(this.eventTicketList){
          this.eventTicketAlertMSG= false;
        }
        this.editEventForm.controls['event_name'].setValue(this.singleEventDetail.event_title)
        this.editEventForm.controls['event_start_date'].setValue(this.singleEventDetail.start_date)
        this.editEventForm.controls['event_start_time'].setValue(this.singleEventDetail.start_time)
        this.editEventForm.controls['event_end_date'].setValue(this.singleEventDetail.end_date)
        this.editEventForm.controls['event_end_time'].setValue(this.singleEventDetail.end_time)
        this.editEventForm.controls['vanue_name'].setValue(this.singleEventDetail.venue_name)
        this.editEventForm.controls['vanue_zip'].setValue(this.singleEventDetail.postal_code)
        this.editEventForm.controls['vanue_country'].setValue(this.singleEventDetail.country)
        this.editEventForm.controls['online_platform'].setValue(this.singleEventDetail.platform)
        this.editEventForm.controls['online_link'].setValue(this.singleEventDetail.event_link)
        this.editEventForm.controls['description'].setValue(this.singleEventDetail.description)
        this.editEventForm.controls['timezone'].setValue(this.singleEventSetting.timezone)
        this.editEventForm.controls['donation_title'].setValue(this.singleEventSetting.donation_title)
        this.editEventForm.controls['donation_amount'].setValue(this.singleEventSetting.donation_amt)
        this.editEventForm.controls['donation_description'].setValue(this.singleEventSetting.donation_description)
        this.editEventForm.controls['book_btn_title'].setValue(this.singleEventSetting.event_button_title)
        this.editEventForm.controls['ticket_available'].setValue(this.singleEventSetting.ticket_avilable)
        this.editEventForm.controls['ticket_unavailable'].setValue(this.singleEventSetting.ticket_unavilable)
        this.editEventForm.controls['redirect_url'].setValue(this.singleEventSetting.redirect_url)
        this.editEventForm.controls['access_code'].setValue(this.singleEventSetting.access_code)
        this.redirectURL= this.singleEventSetting.redirect_confirm_page;
        this.hideEventSearch= this.singleEventSetting.hide_office_listing;
        this.customSalesTax= this.singleEventSetting.custom_sales_tax;
        this.accessCode= this.singleEventSetting.customer_access_code;
        this.donation= this.singleEventSetting.make_donation;
        this.shareButtonStatus= this.singleEventSetting.hide_share_button;
        this.olPlatForm = this.singleEventDetail.online_event;
        this.salesTaxVal = JSON.parse(this.singleEventSetting.sales_tax);
        this.salesTax.length = 0;
        // this.customSalesTaxForm = null;
        this.customSalesTaxArr = this.customSalesTaxForm.get('customSalesTaxArr') as FormArray;
        this.salesTaxVal.forEach(element=>{
          // this.createSalesTaxItem(element.amount, element.label)
          // this._formBuilder.group({
          //   amount: [element.amount],
          //   label: [element.label]
          // });
          this.customSalesTaxArr.push(this.createSalesTaxItem(element.amount, element.label));
        })
        this.salesTax = this.customSalesTaxForm.value.customSalesTaxArr;
        this.customSalesTaxArr.removeAt(this.createSalesTaxItem[0]);
        this.salesTax.shift();
      }
    });
  }

  fnSelectImage(imageType){
    this.eventImageType = imageType
  }
  
  fnSelectDefaultImage(imageName){
    this.selecetdDefaultImage = imageName;
  }

  

  // add Event Fns
  
  fnChangeEventStartDate(){
    this.minEventEndDate = this.editEventForm.get('event_start_date').value;
    this.editEventForm.get('event_end_date').setValue('');
    this.editEventForm.get('event_end_time').setValue('');
  }
  
  fnChangeEventEndDate(){
    // let startDate = this.editEventForm.get('event_start_date').value;
    // let endDate = this.editEventForm.get('event_end_date').value;
    // if(startDate == endDate){
    //   this.startEndSameDate = true;
    // }else{
    //   this.startEndSameDate = false;
    // }
    // this.minEventEndDate = this.editEventForm.get('event_start_date').value;
    // this.editEventForm.get('event_end_date').setValue('');
    // this.editEventForm.get('event_end_time').setValue('');
  }

  fnChangeStartTime(event){
   // this.eventStartTime = this.editEventForm.get('event_start_time').value;
  }

  
  fnChangeDonation(event){
    if(event.checked == true){
      this.donation = 'Y' ;
      this.editEventForm.controls["donation_title"].setValidators(Validators.required);
      this.editEventForm.controls["donation_amount"].setValidators(Validators.required);
      this.editEventForm.controls["donation_description"].setValidators(Validators.required);
      this.editEventForm.controls["donation_title"].updateValueAndValidity();
      this.editEventForm.controls["donation_amount"].updateValueAndValidity();
      this.editEventForm.controls["donation_description"].updateValueAndValidity();
    }else{
      this.donation = 'N' 
      this.editEventForm.controls["donation_title"].setValidators(null);
      this.editEventForm.controls["donation_amount"].setValidators(null);
      this.editEventForm.controls["donation_description"].setValidators(null);
      this.editEventForm.controls["donation_title"].updateValueAndValidity();
      this.editEventForm.controls["donation_amount"].updateValueAndValidity();
      this.editEventForm.controls["donation_description"].updateValueAndValidity();
    }
    this.editEventForm.updateValueAndValidity();
  }

  fnRedirectURL(event){
    if(event.checked == true){
      this.redirectURL = 'Y' 
      this.editEventForm.controls["redirect_url"].setValidators(Validators.required);
      this.editEventForm.controls["redirect_url"].updateValueAndValidity();
    }else{
      this.redirectURL = 'N' 
      this.editEventForm.controls["redirect_url"].setValidators(null);
      this.editEventForm.controls["redirect_url"].updateValueAndValidity();
    }
    this.editEventForm.updateValueAndValidity();
  }

  fnAccessCode(event){
    if(event.checked == true){
      this.accessCode = 'Y' 
      this.editEventForm.controls["access_code"].setValidators(Validators.required);
      this.editEventForm.controls["access_code"].updateValueAndValidity();
  
    }else{
      this.accessCode = 'N' 
      this.editEventForm.controls["access_code"].setValidators(null);
      this.editEventForm.controls["access_code"].updateValueAndValidity();
    }
    this.editEventForm.updateValueAndValidity();
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
      this.editEventForm.controls["online_platform"].setValidators(Validators.required);
      this.editEventForm.controls["vanue_name"].setValidators(null);
      this.editEventForm.controls["vanue_zip"].setValidators(null);
      this.editEventForm.controls["vanue_country"].setValidators(null);
      this.editEventForm.controls["online_platform"].updateValueAndValidity();
      this.editEventForm.controls["vanue_name"].updateValueAndValidity();
      this.editEventForm.controls["vanue_zip"].updateValueAndValidity();
      this.editEventForm.controls["vanue_country"].updateValueAndValidity();
    }else{
      this.olPlatForm = 'N';
      this.editEventForm.controls["online_platform"].setValidators(null);
      this.editEventForm.controls["vanue_name"].setValidators(Validators.required);
      this.editEventForm.controls["vanue_zip"].setValidators(Validators.required);
      this.editEventForm.controls["vanue_country"].setValidators(Validators.required);
      this.editEventForm.controls["online_platform"].updateValueAndValidity();
      this.editEventForm.controls["vanue_name"].updateValueAndValidity();
      this.editEventForm.controls["vanue_zip"].updateValueAndValidity();
      this.editEventForm.controls["vanue_country"].updateValueAndValidity();
    }
    this.editEventForm.updateValueAndValidity();
  }
  
  fnDeleteTicket(ticketCode, index){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code' : ticketCode
    }
    this.SingleEventServiceService.deleteTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        if (index > -1) {
            this.eventTicketList.splice(index, 1);
        }
      }
      else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    })
  }

  fnSaveEvent(){
    this.customSalesTaxArr = this.customSalesTaxForm.get('customSalesTaxArr') as FormArray;
    this.salesTax = this.customSalesTaxForm.value.customSalesTaxArr;
    if(this.editEventForm.invalid){
      this.editEventForm.get('event_name').markAsTouched();
      this.editEventForm.get('event_start_date').markAsTouched();
      this.editEventForm.get('event_start_time').markAsTouched();
      this.editEventForm.get('event_end_date').markAsTouched();
      this.editEventForm.get('event_end_time').markAsTouched();
      this.editEventForm.get('description').markAsTouched();
      this.editEventForm.get('timezone').markAsTouched();
      this.editEventForm.get('book_btn_title').markAsTouched();
      this.editEventForm.get('ticket_available').markAsTouched();
      this.editEventForm.get('ticket_unavailable').markAsTouched();
      this.editEventForm.get('donation_title').markAsTouched();
      this.editEventForm.get('donation_amount').markAsTouched();
      this.editEventForm.get('donation_description').markAsTouched();
      this.editEventForm.get('redirect_url').markAsTouched();
      this.editEventForm.get('access_code').markAsTouched();
      this.editEventForm.get('vanue_name').markAsTouched();
      this.editEventForm.get('vanue_zip').markAsTouched();
      this.editEventForm.get('vanue_country').markAsTouched();
      return false;
    }
    let requestObject = {
      'unique_code' : this.singleEventDetail.unique_code,
      'boxoffice_id':this.boxOfficeCode,
      'event_title':this.editEventForm.get('event_name').value,
      'start_date':this.datePipe.transform(new Date(this.editEventForm.get('event_start_date').value),"yyyy-MM-dd"),
      'end_date': this.datePipe.transform(new Date(this.editEventForm.get('event_end_date').value),"yyyy-MM-dd"),
      'start_time':this.editEventForm.get('event_start_time').value,
      'end_time':this.editEventForm.get('event_end_time').value,
      'venue_name':this.editEventForm.get('vanue_name').value,
      'postal_code':this.editEventForm.get('vanue_zip').value,
      'country':this.editEventForm.get('vanue_country').value,
      'online_event':this.olPlatForm,
      'description':this.editEventForm.get('description').value,
      'platform':this.editEventForm.get('online_platform').value,
      'event_link':this.editEventForm.get('online_link').value,
      'event_status':'draft',
      'timezone':this.editEventForm.get('timezone').value,
      'make_donation':this.donation,
      'event_button_title':this.editEventForm.get('book_btn_title').value,
      'donation_title':this.editEventForm.get('donation_title').value,
      'donation_amt':this.editEventForm.get('donation_amount').value,
      'donation_description':this.editEventForm.get('donation_description').value,
      'ticket_avilable':this.editEventForm.get('ticket_available').value,
      'ticket_unavilable':this.editEventForm.get('ticket_unavailable').value,
      'redirect_confirm_page':this.redirectURL,
      'redirect_url':this.editEventForm.get('redirect_url').value,
      'hide_office_listing':this.hideEventSearch,
      'customer_access_code':this.accessCode,
      'access_code':this.editEventForm.get('access_code').value,
      'hide_share_button':this.shareButtonStatus,
      'custom_sales_tax':this.customSalesTax,
      'sales_tax':this.salesTax,
      'tickets':this.eventTicketList,
      'image' : this.newEventImageUrl,
      'default-image' : this.selecetdDefaultImage,
      };
      this.updateEvent(requestObject);
  }

  updateEvent(requestObject){
    this.isLoaderAdmin = true;
    this.SingleEventServiceService.updateEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.getSingleEvent();
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;

  }

  fnEditTicket(index){
    this.selectedTicketDetail = this.eventTicketList[index];
    const dialogRef = this.dialog.open(AddNewTicketType,{
      width: '1100px',
      data : {
        boxOfficeCode : this.boxOfficeCode,
        fullDayTimeSlote : this.fullDayTimeSlote,
        selectedTicketDetail : this.selectedTicketDetail,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if (index > -1) {
            this.eventTicketList.splice(index, 1);
        }
        this.eventTicketList.push(result)
        this.eventTicketAlertMSG = false;
      }
    });
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
      if(result){
        this.eventTicketList.push(result)
        this.eventTicketAlertMSG = false;
      }else{
        this.getSingleEvent();
      }
    });
  }

  openAddNewTicketGroupDialog() {
    const dialogRef = this.dialog.open(AddNewTicketGroup,{
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  

  fnUploadEventImage(){
    const dialogRef = this.dialog.open(DialogEditEventImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.newEventImageUrl = result;
           }
     });
  }

}



@Component({
  selector: 'profile-image-upload',
  templateUrl: '../_dialogs/image-upload.html',
})
export class DialogEditEventImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogEditEventImageUpload>,
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
  advanceSetting:any = 'N';
  // onlynumeric = /^-?(0|[1-9]\d*)?$/
  onlynumeric = /^[0-9]+(?:\.[0-9]+)?$/
  fullDayTimeSlote:any;
  newTicketData:any;
  selectedTicketDetail:any;
  editTicket : boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddNewTicketType>,
    private _formBuilder: FormBuilder,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private SingleEventServiceService: SingleEventServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode
      this.fullDayTimeSlote = this.data.fullDayTimeSlote
      this.selectedTicketDetail = this.data.selectedTicketDetail
      if(this.selectedTicketDetail){
        this.editTicket = true;
        this.advanceSetting = this.selectedTicketDetail.advance_setting
        this.addTicketForm = this._formBuilder.group({
          title: [this.selectedTicketDetail.ticket_name,[Validators.required]],
          price: [this.selectedTicketDetail.prize,[Validators.required]],
          qty: [this.selectedTicketDetail.qty,[Validators.required]],
          description: [this.selectedTicketDetail.description,[]],
          fee: [this.selectedTicketDetail.booking_fee,[Validators.pattern(this.onlynumeric)]],
          status: [this.selectedTicketDetail.status,[]],
          min_order: [this.selectedTicketDetail.max_per_order,[Validators.pattern(this.onlynumeric)]],
          max_order: [this.selectedTicketDetail.min_per_order,[Validators.pattern(this.onlynumeric)]],
          until_date: [this.selectedTicketDetail.untill_date,[Validators.required]],
          until_time: [this.selectedTicketDetail.untill_time,[Validators.required]],
          until_interval: [this.selectedTicketDetail.untill_interval,[Validators.required]],
          after_date: [this.selectedTicketDetail.after_date,[Validators.required]],
          after_time: [this.selectedTicketDetail.after_time,[Validators.required]],
          after_interval: [this.selectedTicketDetail.after_interval,[Validators.required]]
        });
      }else{
        this.editTicket = false;
        this.addTicketForm = this._formBuilder.group({
          title: ['',[Validators.required]],
          price: ['',[Validators.required]],
          qty: ['',[Validators.required]],
          description: [null,[Validators.required]],
          fee: [null,[Validators.pattern(this.onlynumeric)]],
          status: [null,[Validators.required]],
          min_order: [null,[Validators.pattern(this.onlynumeric)]],
          max_order: [null,[Validators.pattern(this.onlynumeric)]],
          until_date: ['',[Validators.required]],
          until_time: ['',[Validators.required]],
          until_interval: ['',[Validators.required]],
          after_date: ['',[Validators.required]],
          after_time: ['',[Validators.required]],
          after_interval: ['',[Validators.required]]
        });
      } 
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
    this.SingleEventServiceService.getAllCouponCodes(requestObject).subscribe((response:any) => {
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

  fnChangeAdvSetting(event){
    if(event.checked == true){
      this.advanceSetting = 'Y';
    }else{
      this.advanceSetting = 'N';
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

    if(this.editTicket){
      let requestObject = {
        'unique_code': this.selectedTicketDetail.unique_code,
        'box_office_id': this.boxOfficeCode,
        'ticket_name': this.addTicketForm.get('title').value,
        'prize': this.addTicketForm.get('price').value,
        'qty': this.addTicketForm.get('qty').value,
        'advance_setting': this.advanceSetting,
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
      this.UpdateTicket(requestObject);
    }else {
      
    this.newTicketData = {
      'box_office_id': this.boxOfficeCode,
      'ticket_name': this.addTicketForm.get('title').value,
      'prize': this.addTicketForm.get('price').value,
      'qty': this.addTicketForm.get('qty').value,
      'advance_setting': this.advanceSetting,
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
    this.dialogRef.close(this.newTicketData);
    }
  }


  UpdateTicket(requestObject){
    this.isLoaderAdmin = true;
    this.SingleEventServiceService.UpdateTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.dialogRef.close(requestObject);
        // this.dialogRef.close();
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