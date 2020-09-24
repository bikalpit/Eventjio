import {Component, OnInit, ViewChild,Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuperadminService } from '../_services/superadmin.service';
import { ErrorService } from '../../_services/error.service'

interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
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
  timeIntervals:any = [];
  allBoxOfficeList:any;
  upcomingEventData:any;
  // upcomingEventData = [{event:'Lajawab Cooking Classes',status:'Draft',sold:'00',remaining:'00',revenue:'$.00.00',togglebtn:''},
  //               {event:'Draculla Drinks',status:'Draft',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},
  //               {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},]
 
  pastEventData = [{event:'Lajawab Cooking Classes',status:'Draft',sold:'00',remaining:'00',revenue:'$.00.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},
                ]    

  salesTax = [ ];
  salesTaxValue = [{
    amount:'',
    label:'',
  }];
  
  minEventStartDate:any = new Date();
  minEventEndDate:any = new Date();
  // minEndTime:any;
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private SuperadminService: SuperadminService,
    ) {
      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');
      }
      // this.add_mins = this.slotDuration * 60;
      // while(this.slotStartTime <= this.slotEndTime){
      //  this.timeIntervals = Date("h:i", this.slotStartTime);
      //  this.slotStartTime += $add_mins;
      // }
      console.log(this.timeIntervals);
      this.salesTax.length = 1;

      this.addEventForm = this._formBuilder.group({
        event_name: ['',[Validators.required]],
        event_start_date: ['',Validators.required],
        event_start_time: ['',Validators.required],
        event_end_date: ['',Validators.required],
        event_end_time: ['',Validators.required],
        vanue_name: [''],
        vanue_zip: [''],
        vanue_country: [''],
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

    }

   
  ngOnInit(): void {
    this.getAllCountry();
    this.getAllTimeZone();
    this.getDefaultImages();
    this.fnGetAllEventList();
    
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

  getAllTimeZone(){
    this.SuperadminService.getAllTimeZone().subscribe((response:any) => {
      if(response.data == true){
        this.allTimeZone = response.response
      }
    });
  }

  // List Event fns

  fnGetAllEventList(){
    let requestObject = {
      'boxoffice_id'  :this.boxOfficeCode
    }
    this.isLoaderAdmin = true;
    this.SuperadminService.fnGetAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allBoxOfficeList = response.response
        this.upcomingEventData = this.allBoxOfficeList;
        console.log(this.allBoxOfficeList)
        this.addNewEvents = true;
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;

  }


  // add Event Fns
  
  fnChangeEventStartDate(){
    this.minEventEndDate = this.addEventForm.get('event_start_date').value;
    this.addEventForm.get('event_end_date').setValue('');
    this.addEventForm.get('event_end_time').setValue('');
  }

  fnSalesTaxAdd(){
    this.salesTax.push(this.salesTax.length+1);
  }

  fnChangeEventStatus(event){
    console.log(event)
  }

  fnCancelNewEvent(){
    this.addNewEvents = true;
  }

  fnSelectImage(imageType){
    this.eventImageType = imageType
  }
  
  fnSelectDefaultImage(){
    this.selecetdDefaultImage = '';
  }

  fnChangeDonation(event){
    if(event.checked == true){
      this.donation = 'Y' ;
    }else{
      this.donation = 'N' 
    }
  }
  fnRedirectURL(event){
    if(event.checked == true){
      this.redirectURL = 'Y' 
    }else{
      this.redirectURL = 'N' 
    }
  }
  fnAccessCode(event){
    if(event.checked == true){
      this.accessCode = 'Y' 
    }else{
      this.accessCode = 'N' 
    }
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
    }else{
      this.olPlatForm = 'N';
    }
  }
  
  fnAddNewEvent(){
    console.log(this.addEventForm)

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
      return false;
     }



     let requestObject = {
      'boxoffice_id':this.boxOfficeCode,
      'event_title':this.addEventForm.get('event_name').value,
      'start_date':this.addEventForm.get('event_start_date').value,
      'end_date':this.addEventForm.get('event_end_date').value,
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
      'sales_tax':'sales_tax_amt',
      'ticket_ids[]':'',
      'image' : this.newEventImageUrl,
      'default-image' : 'sd',
      };
      this.createNewEvent(requestObject);
  }

  createNewEvent(requestObject){
    this.isLoaderAdmin = true;
    this.SuperadminService.createNewEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
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
      data : {boxOfficeCode : this.boxOfficeCode}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
})
export class AddNewTicketType {
  isLoaderAdmin:boolean = false;
  allCouponCodeList:any;
  boxOfficeCode:any
  addTicketForm:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddNewTicketType>,
    private _formBuilder: FormBuilder,
    private ErrorService: ErrorService,
    private SuperadminService: SuperadminService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode

      this.addTicketForm = this._formBuilder.group({
        title: [''],
        price: [''],
        qty: [''],
        description: [''],
        fee: [''],
        status: [''],
        min_order: [''],
        max_order: [''],
        until_date: [''],
        until_time: [''],
        until_interval: [''],
        after_date: [''],
        after_time: [''],
        after_interval: ['']
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

  fnAddCoupon(event, couponId){

  }

  fnSubmitAddTicketForm(){
    if(this.addTicketForm.invalid){
      this.addTicketForm.get('title').markAsTouched

      return false;
    }

    let requestObject = {
      'ticket_name': this.addTicketForm.get('title').value,
      'prize': this.addTicketForm.get('price').value,
      'qty': this.addTicketForm.get('qty').value,
      'advance_setting': 'Y',
      'description':  this.addTicketForm.get('description').value,
      'booking_fee':  this.addTicketForm.get('fee').value,
      'status':  this.addTicketForm.get('status').value,
      'min_per_order':  '10',
      'max_per_order':'20',
      'hide_untill': 'Y',
      'hide_after':  'Y',
      'untill_date': '',
      'untill_time': '',
      'after_date':  '',
      'after_time':  '',
      'sold_out':  'Y',
      'show_qty':  'Y',
      'discount':  '',
      'untill_interval':  '',
      'after_interval':  '',
    }
    
    this.createNewTicket(requestObject)
    console.log(this.addTicketForm)
  }


  createNewTicket(requestObject){
    this.isLoaderAdmin = true;
    this.SuperadminService.createNewTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
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
})
export class AddNewTicketGroup {
  constructor(
    public dialogRef: MatDialogRef<AddNewTicketGroup>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}