import { Component, OnInit, Inject } from '@angular/core';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

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
  selectedEvent : any;
  singleEventDetail:any;
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

  constructor(
    private SingleEventServiceService: SingleEventServiceService,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private router: Router,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { 
    if(localStorage.getItem('selectedEventCode')){
      this.selectedEvent = localStorage.getItem('selectedEventCode')
    }
     this.salesTax.length = 1;

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
       // console.log(this.fullDayTimeSlote)
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
        this.singleEventDetail= response.response[0];
        console.log(this.singleEventDetail)
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
        this.editEventForm.controls['timezone'].setValue(this.singleEventDetail.timezone)
        this.editEventForm.controls['donation_title'].setValue(this.singleEventDetail.donation_title)
        this.editEventForm.controls['donation_amount'].setValue(this.singleEventDetail.donation_amt)
        this.editEventForm.controls['donation_description'].setValue(this.singleEventDetail.donation_description)
        this.editEventForm.controls['book_btn_title'].setValue(this.singleEventDetail.event_button_title)
        this.editEventForm.controls['ticket_available'].setValue(this.singleEventDetail.ticket_avilable)
        this.editEventForm.controls['ticket_unavailable'].setValue(this.singleEventDetail.ticket_unavilable)
        this.editEventForm.controls['redirect_url'].setValue(this.singleEventDetail.redirect_url)
        this.editEventForm.controls['access_code'].setValue(this.singleEventDetail.access_code)
        this.redirectURL= this.singleEventDetail.redirect_confirm_page;
        this.hideEventSearch= this.singleEventDetail.hide_office_listing;
        this.customSalesTax= this.singleEventDetail.custom_sales_tax;
        this.accessCode= this.singleEventDetail.customer_access_code;
        this.donation= this.singleEventDetail.make_donation;
        this.shareButtonStatus= this.singleEventDetail.hide_share_button;
        this.olPlatForm = this.singleEventDetail.online_event;
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
  

  fnUploadEventImage(){
    const dialogRef = this.dialog.open(DialogEditEventImageUpload, {
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
