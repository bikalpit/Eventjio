import { Component, OnInit, ViewChild,Inject,ChangeDetectorRef } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { AuthenticationService } from '../../_services/authentication.service';
import { ErrorService } from '../../_services/error.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperadminService } from '../_services/superadmin.service';
import { DatePipe, JsonPipe} from '@angular/common';
import { ExportToCsv } from 'export-to-csv';
import { Router, RouterOutlet ,ActivatedRoute} from '@angular/router';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import {  environment } from '../../../environments/environment'

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [DatePipe]
})
export class OrdersComponent implements OnInit {
  animal :any;
  isLoaderAdmin:boolean = false;
  allBusiness: any;
  boxOfficeCode:any;
  addOrderFormType:any;
  allorderlist:any;
  eventCode:any;
  displayedColumns: string[] = ['orderid','status','name','datetime','event','value','action'];
  search="";
  
  ordersApiUrl:any =  `${environment.apiUrl}/get-all-order`;
  
  current_page_orders:any;
  first_page_url_orders:any;
  last_page_orders:any;
  last_page_url_orders:any;
  next_page_url_orders:any;
  prev_page_url_orders:any;
  path_orders:any;

  start_date:any;
  end_date:any;
  order_status:any = "";
  allEventlist:any = [];
  new_date=new Date();
  single_order_event:any;
  currentUser:any;


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public superadminService : SuperadminService,
    private authenticationService : AuthenticationService,
    private ErrorService : ErrorService,
    private datePipe:DatePipe,
    public router: Router,
    public change: ChangeDetectorRef
  ) { 

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if(this.currentUser.type == 'member' &&  this.currentUser.permission != 'A'){
      if(localStorage.getItem('permision_OM') != 'TRUE'){
        this.router.navigate(['/super-admin']);
      }
    }

    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
    }

    if(localStorage.getItem('selectedEventCode')){
      this.eventCode = localStorage.getItem('selectedEventCode')
    }
  }
 

  ngOnInit(): void {
     this.fngetallOrders();
     this.fnGetAllEventList();
  }

  
  fnTicketCheckout(fromType){
    this.addOrderFormType = fromType;
  }

  editOrder(Orderdata){
    const dialogRef = this.dialog.open(EditorderDialog, {
      width: '700px',
      data : Orderdata
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.fnGetAllEventList();
    });
  }  
  
  cancelOrder(Orderdata){

    const dialogRef = this.dialog.open(cancelOrderDialog, {
      width: '700px',
      data : Orderdata
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.fnGetAllEventList();
     });
  }  

  resendOrder(OrderId){

    this.isLoaderAdmin=true;
   
    this.superadminService.fnResendOrder(OrderId).subscribe((response:any)=>{
      if(response.data == true){   
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin=false;
    });

  }

  exportOredr() {
    const dialogRef = this.dialog.open(ExportOrderDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
    
  }

  DownloadTickets(orders) {

    window.open(`${environment.apiUrl}/download-tickets?unique_code=${orders.unique_code}`);

    // const dialogRef = this.dialog.open(eventSummaryDialog, {
    //   width: '700px',
    //   data :{selecetedEvent : this.eventCode}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   this.animal = result;
    // });
  }

  addNewOredr() {
    const dialogRef = this.dialog.open(AddNewOrderDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  
  fnGetAllEventList(){

    let requestObject={
      "boxoffice_id": this.boxOfficeCode,
      "filter":'all',
    }

    this.superadminService.getAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allEventlist = response.response;
        console.log(this.allEventlist);
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.change.detectChanges();
    });

  }
  

  fngetallOrders(){
 
    this.isLoaderAdmin = true;
    
    let requestObject = {
      'order_fromdate' : this.start_date ? this.datePipe.transform(new Date(this.start_date),"yyyy-MM-dd"): '',
      'order_todate' : this.end_date  ? this.datePipe.transform(new Date(this.end_date),"yyyy-MM-dd"): '',
      'global_search' : this.search,
      "boxoffice_id" : this.boxOfficeCode,
      "event_id":   this.single_order_event ? this.single_order_event : 'all',
      "order_status" : this.order_status ? this.order_status : 'all',
    }

    this.superadminService.fnGetallOrders(this.ordersApiUrl,requestObject).subscribe((response:any) => {

      if(response.data == true){

        this.allorderlist =  response.response.data;
        this.current_page_orders = response.response.current_page;
        this.first_page_url_orders = response.response.first_page_url;
        this.last_page_orders = response.response.last_page;
        this.last_page_url_orders = response.response.last_page_url;
        this.next_page_url_orders = response.response.next_page_url;
        this.prev_page_url_orders = response.response.prev_page_url;
        this.path_orders = response.response.path;
      }else{
          this.ErrorService.errorMessage(response.response);
          this.allorderlist = [];
      }
      this.isLoaderAdmin = false;
    });
    
  } 

  arrayOne_orders(n: number): any[] {
    return Array(n);
  }
      
  navigateTo_orders(api_url){
    this.ordersApiUrl=api_url;
    if(this.ordersApiUrl){
      this.fngetallOrders();
    }
  }

  navigateToPageNumber_orders(index){
    this.ordersApiUrl=this.path_orders+'?page='+index;
    if(this.ordersApiUrl){
      this.fngetallOrders();
    }
  }

}

@Component({
  selector: 'Export-Orders',
  templateUrl: '../_dialogs/export-orders.html',
})
export class ExportOrderDialog { 
  
  reportType:any = 'overview';
  boxOfficeCode:any;
  selectedOrderArr:any;
  selectedOrderArryyy:any;
  orderDetails:any = "N";
  eventDetails:any = "N";
  buyerDetails:any = "N";
  orderDetails_id:any = "N";
  orderDetailsticket_check:any = "N";
  orderDetailOrder_cancel:any = "N";
  orderDetailOrder_date:any = "N";
  orderDetailTax_amount:any = "N";
  orderDetailVoucher_code:any = "N";
  orderDetailTicket_charge:any = "N";
  eventDetailsEvent_id:any = "N";
  eventDetailsEvent_name:any = "N";
  eventDetailsEvent_start:any = "N";
  eventDetailsEvent_end:any = "N";
  buyerDetailsFirstname:any = "N";
  buyerDetailsLastname:any = "N";
  buyerDetailsemail:any = "N";
  buyerDetailsPhone:any = "N";
  buyerDetailsAddress1:any = "N";
  buyerDetailsAddress2:any = "N";
  buyerDetailsAddress3:any = "N";
  buyerDetailsPostcode:any = "N";
  orderDetailsTotal_paid:any = "N";
  orderDetailspayment_method:any = "N";
  orderDetailsReferral_tag:any = "N";
  orderDetailsDiscount_code:any = "N";
  orderDetailscancel_reason:any = "N";
  orderDetailstransaction_id:any = "N";
  Ticket_type:any ="N";
  Ticket_description:any = "N";
  Ticket_value:any = "N";
  booking_fee:any = "N";
  ticket_details:any = "N";
  lineitem_details:any = "N";
  line_type:any = "N";
  line_description:any = "N";
  line_value:any = "N";
  linebooking_fee:any = "N";
  lineitem_ticket:any = "N";
  lineitem_voidticket:any = "N";
  lineitem_transactioncharge:any = "N";
  lineitem_taxes:any = "N";
  lineitem_giftcard:any = "N";
  lineitem_donation:any = "N";
  eventName:any;
  buyerArray:any;
  orderArray:any;
  eventArray:any;
  orderuniqueCode:any;
  buyers:any =[];
  orderFieldList:any =[];
  eventFieldList:any =[];
  buyerFieldList:any =[];

  constructor(
    public dialogRef: MatDialogRef<ExportOrderDialog>,
    private http: HttpClient,
    public superadminService : SuperadminService,
    private ErrorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
      }
      if(localStorage.getItem('selectedEventCode')){
        this.orderuniqueCode = localStorage.getItem('selectedEventCode')
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  

  fnOrdersDetails(event){
    if(event.checked == true){
    this.orderDetails = 'Y'
    }else{
      this.orderDetails = 'N' 
    }
  }

  fnOrdersDetailsOrder_id(event){
    if(event.checked == true){
      this.orderDetails_id = 'Y'
      }else{
        this.orderDetails_id = 'N' 
    }
  }
  fnOrdersDetailsticket_check(event){
    if(event.checked == true){
      this.orderDetailsticket_check = 'Y'
      }else{
        this.orderDetailsticket_check = 'N' 
    }
  }
  fnOrdersDetailsOrder_cancel(event){
    if(event.checked == true){
      this.orderDetailOrder_cancel = 'Y'
      }else{
     this.orderDetailOrder_cancel = 'N' 
    }
  }
  fnOrdersDetailsVoucherCode(event){
    if(event.checked == true){
      this.orderDetailVoucher_code = 'Y'
      }else{
     this.orderDetailVoucher_code = 'N' 
    }
  }
  fnOrdersDetailsTax_amont(event){
    if(event.checked == true){
      this.orderDetailTax_amount = 'Y'
      }else{
     this.orderDetailTax_amount = 'N' 
    }
  }
  fnOrdersDetailsOrder_date(event){
    if(event.checked == true){
      this.orderDetailOrder_date = 'Y'
      }else{
     this.orderDetailOrder_date = 'N' 
    }
  }
  fnOrdersDetailsTicket_charge(event){
    if(event.checked == true){
      this.orderDetailTicket_charge = 'Y'
      }else{
     this.orderDetailTicket_charge = 'N' 
    }
  }
 
  //overview report event details

  fnEventDetails(event){
    if(event.checked == true){
      this.eventDetails = 'Y' 
    }else{
      this.eventDetails = 'N' 
    }
  }

  fnEventDetailsEvent_id(event){
    if(event.checked == true){
      this.eventDetailsEvent_id = 'Y' 
    }else{
      this.eventDetailsEvent_id = 'N' 
    }
  }

  fnEventDetailsEvent_name(event){
    if(event.checked == true){
      this.eventDetailsEvent_name = 'Y' 
    }else{
      this.eventDetailsEvent_name = 'N' 
    }
  }

  fnEventDetailsEvent_end(event){
    if(event.checked == true){
      this.eventDetailsEvent_end = 'Y' 
    }else{
      this.eventDetailsEvent_end = 'N' 
    }
  }
  fnEventDetailsEvent_start(event){
    if(event.checked == true){
      this.eventDetailsEvent_start = 'Y' 
    }else{
      this.eventDetailsEvent_start = 'N' 
    }
  }
 
  //overview report buyers details

  fnBuyersDetails(event){
    if(event.checked == true){
      this.buyerDetails = 'Y' 
    }else{
      this.buyerDetails = 'N' 
    }
  }
  fnBuyersDetailsFirstname(event){
    if(event.checked == true){
      this.buyerDetailsFirstname = 'Y' 
    }else{
      this.buyerDetailsFirstname = 'N' 
    }
  }
  fnBuyersDetailsLastname(event){
    if(event.checked == true){
      this.buyerDetailsLastname = 'Y' 
    }else{
      this.buyerDetailsLastname = 'N' 
    }
  }
  fnBuyersDetailsEmail(event){
    if(event.checked == true){
      this.buyerDetailsemail = 'Y' 
    }else{
      this.buyerDetailsemail = 'N' 
    }
  }
  fnBuyersDetailsPhone(event){
    if(event.checked == true){
      this.buyerDetailsPhone = 'Y' 
    }else{
      this.buyerDetailsPhone = 'N' 
    }
  }

  fnBuyersDetailsAdd1(event){
    if(event.checked == true){
      this.buyerDetailsAddress1 = 'Y' 
    }else{
      this.buyerDetailsAddress1 = 'N' 
    }
  }

  fnBuyersDetailsAdd2(event){
    if(event.checked == true){
      this.buyerDetailsAddress2 = 'Y' 
    }else{
      this.buyerDetailsAddress2 = 'N' 
    }
  }

  fnBuyersDetailsAdd3(event){
    if(event.checked == true){
      this.buyerDetailsAddress3 = 'Y' 
    }else{
      this.buyerDetailsAddress3 = 'N' 
    }
  }
  
  fnBuyersDetailsPostcode(event){
    if(event.checked == true){
      this.buyerDetailsPostcode = 'Y' 
    }else{
      this.buyerDetailsPostcode = 'N' 
    }
  }

  fnExportOrderType(event){
    this.reportType=event.value
 }

 //line item checkboxes.

 fnTicket_details(event){
  if(event.checked == true){
    this.ticket_details = 'Y' 
  }else{
    this.ticket_details = 'N' 
  }
 }

 fnLineitem_details(event){
  if(event.checked == true){
    this.lineitem_details = 'Y' 
  }else{
    this.lineitem_details = 'N' 
  } 
 }
  
 //line item type checboxes

 fnLineitem_ticket(event){
  if(event.checked == true){
    this.lineitem_ticket = 'Y' 
  }else{
    this.lineitem_ticket = 'N' 
  } 
 }

 fnLineitem_Voidticket(event){
  if(event.checked == true){
    this.lineitem_voidticket = 'Y' 
  }else{
    this.lineitem_voidticket = 'N' 
  } 
 }

 fnLineitemTransactionCharge(event){
  if(event.checked == true){
    this.lineitem_transactioncharge = 'Y' 
  }else{
    this.lineitem_transactioncharge = 'N' 
  } 
 }

 fnLineitemTaxes(event){
  if(event.checked == true){
    this.lineitem_taxes = 'Y' 
  }else{
    this.lineitem_taxes = 'N' 
  } 
 }

 fnLineitemGift_cards(event){
  if(event.checked == true){
    this.lineitem_giftcard = 'Y' 
  }else{
    this.lineitem_giftcard = 'N' 
  } 
 }

 fnLineitem_donation(event){
  if(event.checked == true){
    this.lineitem_donation= 'Y' 
  }else{
    this.lineitem_donation= 'N' 
  } 
 }

 //line item order-field

 fnOrdersDetailsTotal_paid(event){
    if(event.checked == true){
      this.orderDetailsTotal_paid = 'Y' 
    }else{
      this.orderDetailsTotal_paid = 'N' 
    }
 }

 fnOrdersDetailspayment_method(event){
  if(event.checked == true){
    this.orderDetailspayment_method = 'Y' 
  }else{
    this.orderDetailspayment_method = 'N' 
  }
}

fnOrdersDetailsReferral_tag(event){
  if(event.checked == true){
    this.orderDetailsReferral_tag = 'Y' 
  }else{
    this.orderDetailsReferral_tag = 'N' 
  }
}

fnOrdersDetailsDiscount_code(event){
  if(event.checked == true){
    this.orderDetailsDiscount_code = 'Y' 
  }else{
    this.orderDetailsDiscount_code = 'N' 
  }
}

fnOrdersDetailsCancel_reason(event){
  if(event.checked == true){
    this.orderDetailscancel_reason = 'Y' 
  }else{
    this.orderDetailscancel_reason = 'N' 
  }
}

fnOrdersDetailsTransaction_id(event){
  if(event.checked == true){
    this.orderDetailstransaction_id = 'Y' 
  }else{
    this.orderDetailstransaction_id = 'N' 
  }
}

//line-item ticket details

fnTicket_type(event){
  if(event.checked == true){
    this.Ticket_type = 'Y' 
  }else{
    this.Ticket_type = 'N' 
  }
}

fnTicket_description(event){
  if(event.checked == true){
    this.Ticket_description = 'Y' 
  }else{
    this.Ticket_description = 'N' 
  }
}

fnTicket_value(event){
  if(event.checked == true){
    this.Ticket_value = 'Y' 
  }else{
    this.Ticket_value = 'N' 
  }
}

fnticketBooking_fee(event){
  if(event.checked == true){
    this.booking_fee = 'Y' 
  }else{
    this.booking_fee = 'N' 
  }
}
 
//line-item line-type

fnLine_type(event){
  if(event.checked == true){
    this.line_type = 'Y' 
  }else{
    this.line_type = 'N' 
  }
}

fnline_Description(event){
  if(event.checked == true){
    this.line_description = 'Y' 
  }else{
    this.line_description = 'N' 
  }
}

fnline_Value(event){
  if(event.checked == true){
    this.line_value = 'Y' 
  }else{
    this.line_value = 'N' 
  }
}

fnlineBooking_fee(event){
  if(event.checked == true){
    this.linebooking_fee = 'Y' 
  }else{
    this.linebooking_fee = 'N' 
  }
}

 exportOrder(){
   
  const options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    title: 'My Awesome CSV',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };
  const csvExporter = new ExportToCsv(options);
  // this.buyerArray=this.buyerFieldList.concat('unique_code');
  // this.orderArray=this.orderFieldList.concat('unique_code').concat('customer_id');
  // this.eventArray= this.eventFieldList.concat('unique_code');

  if(this.reportType=="overview"){
  let requestObject ={
    "boxoffice_id":this.boxOfficeCode,
    "report_type":"O",
    "buyer_details": this.buyerDetails,
    "order_details":this.orderDetails,
    "event_details": this.eventDetails,
    "order_id":this.orderDetails_id,
    "tickets_checked_in":this.orderDetailsticket_check,
    "order_canceled":this.orderDetailOrder_cancel,
    "order_date":this.orderDetailOrder_date,
    "tax_amount":this.orderDetailTax_amount,
    "voucher_code_amt":this.orderDetailVoucher_code,
    "ticket_charges":this.orderDetailTicket_charge,
    "event_id":this.eventDetailsEvent_id,
    "event_name":this.eventDetailsEvent_name ,
    "event_start":this.eventDetailsEvent_start,
    "event_end":this.eventDetailsEvent_end,
    "firstname":this.buyerDetailsFirstname,
    "lastname":this.buyerDetailsLastname,
    "email":this.buyerDetailsemail,
    "mobile":this.buyerDetailsPhone,
    "address1":this.buyerDetailsAddress1,
    "address2":this.buyerDetailsAddress2,
    "address3":this.buyerDetailsAddress3,
    "zip":this.buyerDetailsPostcode,
  };

  this.superadminService.fnExportOrders(requestObject).subscribe((response:any)=>{
    if(response.data == true){   
      this.selectedOrderArr = response.response
      // this.selectedOrderArryyy=this.selectedOrderArr.split(" ",20);
      console.log(this.selectedOrderArr);

      csvExporter.generateCsv(this.selectedOrderArr);
      this.ErrorService.successMessage("orders exported successfully");
    }
    else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.ErrorService.errorMessage(response.response);
      // this._snackBar.open(response.response, "X", {
      //   duration: 2000,
      //   verticalPosition: 'top',
      //   panelClass : ['red-snackbar']
      // });
    }
   });
   }
   if(this.reportType=="lineItem"){
   }
 }
}


@Component({
  selector: 'Add-New-Orders',
  templateUrl: '../_dialogs/add-new-order.html',
  providers: [DatePipe]
})
export class AddNewOrderDialog { 
  animal :any;
  allEventlist:any;
  boxOfficeCode:any;
  selectedEvent :any;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddNewOrderDialog>,
    private http: HttpClient,
    private datePipe: DatePipe,
    public superadminService : SuperadminService,
    private ErrorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
      }
      this.fnGetAllEventList();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  ngOnInit() {
  }

  fnBookTicketType(selecetedEvent){
    this.selectedEvent = selecetedEvent;
    this.bookTicket();
    this.dialogRef.close();
  }
  
  fnGetAllEventList(){
    
    let requestObject={
      "boxoffice_id": this.boxOfficeCode,
      "filter":'all',
    }

    this.superadminService.getAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allEventlist = response.response;
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
     });
  }
  
  
  bookTicket() {
    const dialogRef = this.dialog.open(BookTicketDialog, {
      width: '700px',
      data :{selecetedEvent : this.selectedEvent}
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
}

@Component({
  selector: 'Book-ticket',
  templateUrl: '../_dialogs/book-ticket.html',
  providers: [DatePipe]

})
export class BookTicketDialog { 
  addOrderFormType: any ='selectTicket';
  singleorderCustomer:any;
  animal :any;
  bookTickets: FormGroup;
  onlynumeric = /^-?(0|[1-9]\d*)?$/;
  discount = 0;
  total_qty = 0;
  selectedEventCode:any;
  eventTicket:any;
  event_id:any;
  boxOfficeCode:any;
  selecetdTickets : any =[];
  subTotal :any = '0';
  is_added_at_least_item  = true;
  currencyCode = "USD";
  isLoaderAdmin = false;
  orderDetail:any = [];
  orderDate:any;
  eventDate:any;
  order_item_data:any = [];
  customerData :any = [];
  eventForm:any = [];
  eventSpecificForm:any = [];
  is_submit = false;
  
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BookTicketDialog>,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    public superadminService : SuperadminService,
    private authenticationService : AuthenticationService,
    private ErrorService : ErrorService,
    private datePipe: DatePipe,
    private change:ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {

      this.selectedEventCode = this.data.selecetedEvent;

      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
      }
      let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      this.bookTickets = this._formBuilder.group({
        name:["", Validators.required],
        email:["", [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
        address:["", Validators.required],
        phone:['',[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
        
        // repeat_email:["", [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
        // address:["", Validators.required],
        // address_2:[""],
        // address_3:[""],
        // postcode:["", [Validators.required, Validators.pattern(this.onlynumeric),Validators.minLength(5),Validators.maxLength(6)]],
        // attendee_name:["", Validators.required],
         promo_code:["",[Validators.minLength(5),Validators.maxLength(6)]],
      });
  }
    
    

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.fnGeteventTicket();
    this.getEventForm();
  }
 
  getEventForm(){

    this.isLoaderAdmin = true;
    let requestObject = {
      'event_id' : this.selectedEventCode,
      'option_key' : 'checkout_form',
      'boxoffice_id' : 'NULL'
    }

    this.superadminService.getSingleEventSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
        var data =   JSON.parse(response.response);
        // this.attendeeForm = data[0].attendee_questions;
        this.eventForm = data[0].buyer_questions;
        var i = 0; 
        this.eventForm.forEach(element => {
          element.value = '';
          if(element.type=='checkbox'){
            element.selector = this.CheckBoxArr(element.options);
          }
          if(i > 3){
            this.eventSpecificForm.push(element);
          }
          i++;
        });

        console.log(this.eventSpecificForm);


        // this.attendeeForm.forEach(element => {
        //   if(element.type=='checkbox'){
        //     element.selector = this.CheckBoxArr(element.options);
        //   }
        //   element.value = '';
        // });

        
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
  }

  optionsArr(arr){
    return arr.split(/\r?\n/);
  }

  
  CheckBoxArr(arr){
    var optionToArray = [];
    arr.split(/\r?\n/).forEach(element => {
      optionToArray.push({ 'value': element,'is_check':false});
    });
    return optionToArray;
  }


  fnGeteventTicket(){

    let requestObject={
      "event_id":this.selectedEventCode,
    }

    this.superadminService.fnGeteventTicket(requestObject).subscribe((response:any) => {

      if(response.data == true){
        this.eventTicket = response.response;
        this.eventTicket.forEach(element => {
          element.qty = 0;
          element.id_added = false;
        });

      }
    });
  }
   

  fnAddQty(index,value){
    
    this.eventTicket[index].qty = value;
    var single_event = this.eventTicket[index];
    var is_update  = true;
    this.eventTicket[index].id_added = true ;
    this.is_added_at_least_item = true;

    if( single_event.min_per_order  == null && single_event.max_per_order ==  null ){
      this.eventTicket[index].id_added = true;
    }else if( parseInt(single_event.min_per_order)  >  parseInt(single_event.qty)  ){
      this.eventTicket[index].id_added = false ;
      is_update  = false;
      return this.ErrorService.errorMessage('Minimun Quantity  shoulde be '+single_event.min_per_order);
    } else if( parseInt(single_event.qty) > parseInt(single_event.max_per_order) ){
      this.eventTicket[index].qty = single_event.max_per_order;
      this.ErrorService.errorMessage('Maximun Quantity shoulde be'+single_event.min_per_order);
    }

    if(true == is_update){
      this.subTotal = 0;
      this.eventTicket.forEach(element=>{
        if(parseInt(element.qty)  > 0 && element.id_added == true){
          this.is_added_at_least_item = false;
          var total = parseInt(element.qty) * parseInt(element.prize);
          this.subTotal = this.subTotal + total + parseInt(element.booking_fee);
          this.total_qty = this.total_qty +  parseInt(element.qty);
        }
      });

     
    }

  }

  fnAddDiscount(value){
    if(value > this.subTotal){
      return false;
    }
    this.discount = value;
  }

   fnSum(qty,prize,booking_fee){
      return (parseInt(qty)*parseInt(prize))+parseInt(booking_fee);
   }

   async  fnTicketCheckout(fromType){
    
    if(fromType=='CheckoutForm'){
      this.addOrderFormType  = fromType;
      return false;
    }
    
    if(fromType=='selectTicket'){
      this.addOrderFormType  = fromType;
      return false;
    }

    this.is_submit = true;
    var is_error = false;

    if(this.bookTickets.invalid){
      this.bookTickets.get('name').markAsTouched();
      this.bookTickets.get('email').markAsTouched();
      this.bookTickets.get('phone').markAsTouched();
      this.bookTickets.get('address').markAsTouched();
      this.ErrorService.errorMessage('please fill out required fields.');
      return
    }
    var eventFormValue = [];

    var i = 0; 
    await this.eventSpecificForm.forEach(element => {
        if(element.type=='checkbox'){
          var checkBoxArr = [];
          element.selector.forEach(CheckBoxelement => {
            if(CheckBoxelement.is_check){
              checkBoxArr.push(CheckBoxelement.value)
            }
          });
          if(checkBoxArr.length > 0){
            element.value =  JSON.stringify(checkBoxArr); 
          }
        }
        if(element.value==''  && element.required){
          is_error = true;
        }
       // eventFormValue.push(element.value ? element.value : null);
    });

    

    if(is_error){
      this.ErrorService.errorMessage('please fill out required fields.');
      return false;
    }

    var order_item = [];

    this.eventTicket.forEach(element => {
      if(element.qty > 0){
        for(var j=1; j<=parseInt(element.qty); j++){
          order_item.push({
            'ticket_id' : element.unique_code,
            'qty' : 1,
            'discount_code' : this.bookTickets.get('promo_code').value,
            'amount' : element.prize,
            'tax' : 0,
            'sub_total' :   parseInt(element.prize) + parseInt(element.booking_fee),
            'discount_amt' : 0,
            'grand_total' : parseInt(element.prize) + parseInt(element.booking_fee),
            'attendee_data' : []
          });
        }
      }
    });
    

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var todaydate = yyyy + '-' + mm + '-' + dd;

    var name = this.bookTickets.get("name").value.split(" ");
 
    let requestObject = {
      "box_office_id":this.boxOfficeCode,
      "event_id": this.selectedEventCode,
      "ticket_id":this.event_id,
      "customer_firstname": name[0] ? name[0] : '',
      "customer_lastname": name[1] ? name[1]: '',
      "email":this.bookTickets.get("email").value,
      "phone":this.bookTickets.get("phone").value,
      "address":this.bookTickets.get("address").value,
      //"postcode":this.bookTickets.get("postcode").value,
      "qty" : this.total_qty,
      "sub_total" : this.subTotal,
      "order_date" : todaydate,
      "order_time" : today.getHours()+":"+today.getUTCHours(),
      "grand_total" : this.subTotal,
      //"attendee_name" : this.bookTickets.get('attendee_name').value,
      "customer_info" : JSON.stringify({ 'customerForm' : this.eventSpecificForm }),
      "payment_status" : "unpaid",
      "payment_method" : "cash",
      'tickets' : order_item
    }


    this.isLoaderAdmin = true;

    this.superadminService.createOrder(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Order created.');
        this.orderDetail = response.response;
        this.orderDate  = this.datePipe.transform(new Date(this.orderDetail.created_at),"EEE MMM d, y");
        this.eventDate  = this.datePipe.transform(new Date(this.orderDetail.events.start_date),"EEE MMM d, y");
        this.order_item_data = this.orderDetail.order_item;
        this.customerData = this.orderDetail.customer;
        this.addOrderFormType = fromType;
        this.isLoaderAdmin = false;
        this.change.detectChanges();

      }else{
        return  this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
    
    
  }


  resendOrder(){
    this.superadminService.fnResendOrder(this.orderDetail.unique_code).subscribe((response:any)=>{
      if(response.data == true){   
        this.ErrorService.successMessage(response.response);
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
  }

  editOrder(){
    const dialogRef = this.dialog.open(EditorderDialog, {
      width: '700px',
      data : this.orderDetail,
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }  


  fnDownloadTicket(itemId){
    
    window.open(`${environment.apiUrl}/download-single-ticket?unique_code=${itemId}`);

    // this.isLoaderAdmin = true;
    // let requestObject = {
    //   'unique_code' : itemId,
    // }
    // this.superadminService.DownloadTicket(requestObject).subscribe((response: any) => {
    //   if (response.data == true) {
    //     this.ErrorService.errorMessage(response.response);
    //   } else if (response.data == false) {
    //     this.ErrorService.errorMessage(response.response);
    //   }
    //   this.isLoaderAdmin = false;
    // });
  }  


  cancelOrder(){
    console.log(this.orderDetail);

    const dialogRef = this.dialog.open(cancelOrderDialog, {
      width: '700px',
      data : this.orderDetail,
    });
  
    dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
    });
  }  


  fnDownloadInvoice(orderId) {
    window.open(`${environment.apiUrl}/stream-invoice-pdf?order_id=${orderId}`);
  }  
  
 
}

@Component({
  selector: 'Orders-Invoice',
  templateUrl: '../_dialogs/order-invoice.html',
})
export class OrderInvoiceDialog { 
  
  
  constructor(
    public dialogRef: MatDialogRef<OrderInvoiceDialog>,
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
  selector: 'edit-order',
  templateUrl: '../_dialogs/edit-order.html',
})
export class EditorderDialog { 

  editTicket: FormGroup;
  onlynumeric = /^-?(0|[1-9]\d*)?$/;
  singleorderCustomer:any;
  eventForm:any = [];
  eventSpecificForm:any = [];
  selectedEventCode = localStorage.getItem('selectedEventCode');
  is_submit = false;
  boxoffice_id   = localStorage.getItem('boxoffice_id');
  isLoaderAdmin = false;

  constructor(
    public dialogRef: MatDialogRef<EditorderDialog>,
    private http: HttpClient,
    public superadminService : SuperadminService,
    private _formBuilder:FormBuilder,
    private errorMessage:ErrorService,
    private change:ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {

      let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      this.editTicket = this._formBuilder.group({
        name:["", Validators.required],
        email:["", [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
        phone:['',[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
        address:["", Validators.required],
      });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
    
    ngOnInit() {
      this.getEventForm();
      this.fnGetsingleOrder();
    }

    async updateOrder(){

      this.is_submit = true;
      var is_error = false;
  
      if(this.editTicket.invalid){
        this.editTicket.get('name').markAsTouched();
        this.editTicket.get('email').markAsTouched();
        this.editTicket.get('phone').markAsTouched();
        this.editTicket.get('address').markAsTouched();
        this.errorMessage.errorMessage('please fill out required fields.');
        return
      }
  
      var i = 0; 
      await this.eventSpecificForm.forEach(element => {
          if(element.type=='checkbox'){
            var checkBoxArr = [];
            element.selector.forEach(CheckBoxelement => {
              if(CheckBoxelement.is_check){
                checkBoxArr.push(CheckBoxelement.value)
              }
            });
            if(checkBoxArr.length > 0){
              element.value =  JSON.stringify(checkBoxArr); 
            }
          }
          if(element.value==''  && element.required){
            is_error = true;
          }
      });

      if(is_error){
        this.errorMessage.errorMessage('please fill out required fields.');
        return false;
      }
      
      var name = this.editTicket.get("name").value.split(" ");
      
      let requestObject = {
        'event_id' : this.selectedEventCode,
        'boxoffice_id' : this.boxoffice_id,
        'order_id' : this.data.unique_code,
        'firstname' : name[0] ? name[0] : '',
        'lastname' : name[1] ? name[1] : '',
        'phone' : this.editTicket.get("phone").value,
        'email' : this.editTicket.get("email").value,
        'address' : this.editTicket.get("address").value,
        "customer_data" : JSON.stringify({ 'customerForm' : this.eventSpecificForm }),
      }
      
      this.isLoaderAdmin = true;

      this.superadminService.orderUpdate(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.errorMessage.successMessage(response.response);
        } else if(response.data == false){
          this.errorMessage.errorMessage(response.response);
        }
      });


    }

    getEventForm(){

      let requestObject = {
        'event_id' : this.selectedEventCode,
        'option_key' : 'checkout_form',
        'boxoffice_id' : 'NULL'
      }
  
      this.superadminService.getSingleEventSettings(requestObject).subscribe((response:any) => {
        if(response.data == true){
          var data =   JSON.parse(response.response);
          this.eventForm = data[0].buyer_questions;
          this.change.detectChanges();
        } else if(response.data == false){
          this.errorMessage.errorMessage(response.response);
        }
      });

    }

    
    fnGetsingleOrder(){

      let requestObject={
        "unique_code":this.data.unique_code,
      }
      
      this.superadminService. fnGetsingleOrder(requestObject).subscribe((response:any) => {
        if(response.data == true){

          this.singleorderCustomer = response.response;
          this.eventSpecificForm =  JSON.parse(this.singleorderCustomer.customer.customer_data);
          this.eventSpecificForm = this.eventSpecificForm.customerForm;

          this.editTicket.controls['name'].setValue(this.singleorderCustomer.customer.name)
          this.editTicket.controls['email'].setValue(this.singleorderCustomer.customer.email)
          this.editTicket.controls['phone'].setValue(this.singleorderCustomer.customer.phone)
          this.editTicket.controls['address'].setValue(this.singleorderCustomer.customer.address)

          this.change.detectChanges();

        }else{
          this.errorMessage.errorMessage(response.response);
        }
      });
    }

    optionsArr(arr){
      return arr.split(/\r?\n/);
    }
  
    
    CheckBoxArr(arr){
      var optionToArray = [];
      arr.split(/\r?\n/).forEach(element => {
        optionToArray.push({ 'value': element,'is_check':false});
      });
      return optionToArray;
    }
    
}

@Component({
  selector: 'cancel-order',
  templateUrl: '../_dialogs/cancel-order.html',
})
export class cancelOrderDialog { 
  singleorderCustomer:any;
  isLoaderAdmin=false;
  orderDetail:any = [];
  cancelreason;
  eventData:any = [];

  constructor(
    public dialogRef: MatDialogRef<cancelOrderDialog>,
    private http: HttpClient,
    public superadminService : SuperadminService,
    private ErrorService : ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.singleorderCustomer = this.data;
      this.eventData = this.data.events ? this.data.events : [];
      console.log(this.eventData);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
   this.fnGetsingleOrder();
  }
  
   
  fnGetsingleOrder(){
    
    let requestObject={
      "unique_code":this.data.unique_code,
    }

    this.superadminService. fnGetsingleOrder(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.singleorderCustomer = response.response;
      }else{
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  cancelthisOrder(){

    this.isLoaderAdmin = true;

    let requestObject  = { 
      'unique_code' : this.data.unique_code,
      'notes' : this.cancelreason,
      'status' : 'C'
    }

    this.superadminService.cancelOrder(requestObject).subscribe((response:any) => {
      if(response.data == true){
         this.ErrorService.successMessage(response.response);
         this.dialogRef.close();
      }else{
          this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
    
  }


}

@Component({
  selector: 'summary-order',
  templateUrl: '../_dialogs/order-summary.html',
})
export class eventSummaryDialog { 
  singleorderCustomer:any;
  animal :any;
  eventTicket:any;
  selectedEventCode:any;

  constructor(
    public dialogRef: MatDialogRef<eventSummaryDialog>,
    private http: HttpClient,
    public dialog: MatDialog,
    public superadminService : SuperadminService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.selectedEventCode = this.data.selecetedEvent;
     }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    // this.fnGetsingleOrder();
    this.fnGeteventTicket();
  }

  cancelOrder(){
    const dialogRef = this.dialog.open(cancelOrderDialog, {
      width: '700px',
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
  
  editOrder(){
    const dialogRef = this.dialog.open(EditorderDialog, {
      width: '700px',
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }  

  orderInvoice() {
    const dialogRef = this.dialog.open(OrderInvoiceDialog, {
      width: '700px',
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }  
    
  fnGetsingleOrder(){
    let requestObject={
    "unique_code":"ord1602046981560",
  }
  this.superadminService. fnGetsingleOrder(requestObject).subscribe((response:any) => {
    if(response.data == true){
      this.singleorderCustomer = response.response;
      console.log(this.singleorderCustomer);
    }else{
    }
  });
  }

  fnGeteventTicket(){
    let requestObject={
      "event_id":this.selectedEventCode,
    }
    this.superadminService.fnGeteventTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventTicket = response.response;
        this.eventTicket.forEach(element => {
          element.qty = 0;
        });
      }else{
      }
     });
  }

  // fnGetsingleOrder(){
  //   let requestObject={
  //   "unique_code":"ord1602046981560",
  // }
  // this.superadminService. fnGetsingleOrder(requestObject).subscribe((response:any) => {
  //   if(response.data == true){
  //     this.singleorderCustomer = response.response;
  //     console.log(this.singleorderCustomer);
  //   }else{
  //   }
  // });
  // }

}

