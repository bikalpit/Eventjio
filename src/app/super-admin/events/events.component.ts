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
 
 
 
  upcomingEventData = [{event:'Lajawab Cooking Classes',status:'Draft',sold:'00',remaining:'00',revenue:'$.00.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Draft',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},]
 
  pastEventData = [{event:'Lajawab Cooking Classes',status:'Draft',sold:'00',remaining:'00',revenue:'$.00.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},
                ]    
  onlinePlatForm = ['Zoom','Google Hangout','Youtube','Hopin','Vimeo','Skype','Other'] 

  salesTax = [ ];
  
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private superadminService: SuperadminService,
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
    
  }

  getAllCountry(){
    this.superadminService.getAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
      }
    });
  }

  getAllTimeZone(){
    this.superadminService.getAllTimeZone().subscribe((response:any) => {
      if(response.data == true){
        this.allTimeZone = response.response
      }
    });
  }
  
  fnSalesTaxAdd(){
    this.salesTax.push(this.salesTax.length+1);
  }

  fnChangeEventStatus(event){
    console.log(event)
  }

  fnCancelNewEvent(){
    this.addNewEvents = false;
  }

  fnSelectImage(imageType){
    this.eventImageType = imageType
  }

  fnChangeDonation(event){
    if(event.checked == true){
      this.donation = 'Y' 
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

    if(!this.addEventForm.valid){
      this.addEventForm.get('event_name').markAsTouched();
      this.addEventForm.get('event_start_date').markAsTouched();
      this.addEventForm.get('event_start_time').markAsTouched();
      this.addEventForm.get('event_end_date').markAsTouched();
      this.addEventForm.get('event_end_time').markAsTouched();
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
      'event_status':'Draft',
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
      'sales_tax_amt':'sales_tax_amt',
      'sales_tax_label':'sales_tax_label',
      'sales_tax_id':'sales_tax_id',
      'ticket_ids[]':'1,2',
      };
      this.createNewEvent(requestObject);
  }

  createNewEvent(requestObject){
    this.isLoaderAdmin = true;
    this.superadminService.createNewEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;

  }




  
  
  openAddNewTicketTypeDialog() {
    const dialogRef = this.dialog.open(AddNewTicketType,{
      width: '1100px',
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

}


@Component({
  selector: 'add-new-ticket-type',
  templateUrl: '../_dialogs/add-new-ticket-type.html',
})
export class AddNewTicketType {
  constructor(
    public dialogRef: MatDialogRef<AddNewTicketType>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
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