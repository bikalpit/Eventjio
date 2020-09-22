import {Component, OnInit, ViewChild,Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import { SuperadminService } from '../_services/superadmin.service';

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
 
 redirectURL:any;
 customSalesTax:any;
 accessCode:any;
 donationDiv:any;
 olPlatForm : any = 'N';

 addNewEvents : boolean = true;
 public editorValue: string = '';
 addEventForm : FormGroup;
 eventStatus : FormGroup;
 allCountry:any;
 allTimeZone:any;
 boxOfficeCode:AnalyserNode;
 
 
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
    private superadminService: SuperadminService,
    ) {

      this.addEventForm = this._formBuilder.group({
        event_name: ['',[Validators.required]],
        event_start_date: ['',Validators.required],
        event_start_time: ['',Validators.required],
        event_end_date: ['',Validators.required],
        event_end_time: ['',Validators.required],
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
  
  fnAddNewEventsForm(){

    if(!this.addEventForm.valid){
      this.addEventForm.get('event_name').markAsTouched();
      this.addEventForm.get('event_start_date').markAsTouched();
      this.addEventForm.get('event_start_time').markAsTouched();
      this.addEventForm.get('event_end_date').markAsTouched();
      this.addEventForm.get('event_end_time').markAsTouched();
      return false;
     }

     let requestObject = {
      'boxoffice_id':'boxoffice_id',
      'event_title':'event_title',
      'start_date':'start_date',
      'end_date':'end_date',
      'start_time':'start_time',
      'end_time':'end_time',
      'venue_name':'venue_name',
      'postal_code':'postal_code',
      'country':'country',
      'online_event':'online_event',
      'description':'description',
      'platform':'platform',
      'event_link':'event_link',
      'event_status':'event_status',
      'unique_code':'unique_code',
      'timezone':'timezone',
      'make_donation':'make_donation',
      'event_button_title':'event_button_title',
      'donation_title':'donation_title',
      'donation_amt':'donation_amt',
      'donation_description':'donation_description',
      'ticket_avilable':'ticket_avilable',
      'ticket_unavilable':'ticket_unavilable',
      'redirect_confirm_page':'redirect_confirm_page',
      'redirect_url':'redirect_url',
      'hide_office_listing':'hide_office_listing',
      'customer_access_code':'customer_access_code',
      'access_code':'access_code',
      'hide_share_button':'hide_share_button',
      'custom_sales_tax':'custom_sales_tax',
      'sales_tax_amt':'sales_tax_amt',
      'sales_tax_label':'sales_tax_label',
      'sales_tax_id':'sales_tax_id',
      'ticket_ids[]':'ticket_ids[]',
      
      };

  }

  fnolPlatform(event){
    if(event.checked == true){
      this.olPlatForm = 'Y';
    }else{
      this.olPlatForm = 'N';
    }
  }

  fnSalesTaxAdd(){
    this.salesTax.push(this.salesTax.length+1);
  }

  fnChangeEventStatus(event){
    console.log(event)
  }

}


@Component({
  selector: 'add-new-ticket-type',
  templateUrl: '../_dialogs/add-new-ticket-type.html',
})
export class AddNewTicketType {
  constructor(
    public dialogRef: MatDialogRef<AddNewTicketType>,
    private http: HttpClient,
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
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}