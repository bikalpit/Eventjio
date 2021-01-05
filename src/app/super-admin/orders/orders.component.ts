import { Component, OnInit, ViewChild,Inject,ChangeDetectorRef } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { AuthenticationService } from '../../_services/authentication.service';
import { ErrorService } from '../../_services/error.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators ,FormArray} from '@angular/forms';
import { SuperadminService } from '../_services/superadmin.service';
import { DatePipe, JsonPipe} from '@angular/common';
import { ExportToCsv } from 'export-to-csv';
import { Router, RouterOutlet ,ActivatedRoute} from '@angular/router';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import {  environment } from '../../../environments/environment'
import { ServiceService } from 'src/app/_services/service.service';

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
  subPermission:any=[];

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
      }else{
        if(this.currentUser.sub_permission){
          this.subPermission = this.currentUser.sub_permission.split(',',2)
        }
      }
    }else{
      this.subPermission = 'admin';
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
      this.fngetallOrders();
    });
  }  
  
  eventSummary(Orderdata){
    const dialogRef = this.dialog.open(eventSummaryDialog, {
      width: '700px',
      data : {Orderdata: Orderdata,subPermission:this.subPermission}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.fngetallOrders();
    });
  }

  cancelOrder(Orderdata){

    const dialogRef = this.dialog.open(cancelOrderDialog, {
      width: '700px',
      data : Orderdata
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.fngetallOrders();
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

    window.open(`${environment.apiUrl}/stream-invoice-pdf?order_id=${orders.unique_code}`);

  }

  addNewOredr() {
    const dialogRef = this.dialog.open(AddNewOrderDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.fngetallOrders();
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
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.change.detectChanges();
    });

  }
  

  fngetallOrders(){
 
    this.isLoaderAdmin = true;
    
    let requestObject = {
      'global_search' : this.search,
      "boxoffice_id" : this.boxOfficeCode,
      "event_id":   this.single_order_event ? this.single_order_event : 'all',
      "order_status" : this.order_status ? this.order_status : 'all',
    }

    if(this.start_date){
      requestObject ['order_fromdate'] = this.datePipe.transform(new Date(this.start_date),"yyyy-MM-dd");
    }
    
    if(this.end_date){
      requestObject ['order_todate'] = this.datePipe.transform(new Date(this.end_date),"yyyy-MM-dd");
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
  
  isLoaderAdmin =false;

  reportType:any = 'overview';
  boxOfficeCode:any;
  selectedOrderArr:any;
  selectedOrderArryyy:any;
  orderDetails:any = false;
  eventDetails:any = false;
  buyerDetails:any = false;

  eventName:any;
  buyerArray:any;
  orderArray:any;
  eventArray:any;
  orderuniqueCode:any;
  buyers:any =[];
  orderFieldList:any =[];
  eventFieldList:any =[];
  buyerFieldList:any =[];
  
  
  LiBuyerDetail:any = false;
  LiBuyerDetails  = [
    { 'name' : 'buyerDetailsFirstname', 'value' : false, 'lable' : 'FirstName','variable_name' :  'firstname' },
    { 'name' : 'buyerDetailsLastname', 'value' : false, 'lable' : 'lastName','variable_name' :  'lastname'},
    { 'name' : 'buyerDetailsemail', 'value' : false, 'lable' : 'Email' ,'variable_name' :  'email'},
    { 'name' : 'buyerDetailsPhone', 'value' : false, 'lable' : 'Mobile number' ,'variable_name' :  'mobile'},
    { 'name' : 'buyerDetailsAddress1', 'value' : false, 'lable' : 'Address' ,'variable_name' :  'address1'},
    { 'name' : 'buyerDetailsPostcode', 'value' : false, 'lable' : 'Postcode / Zip' ,'variable_name' :  'zip'},
  ];

  LiEvent_detail:any = false;
  LiEventDetails  = [
    { 'name' : 'eventDetailsEvent_id', 'value' : false, 'lable' : 'Event ID'  ,'variable_name' :  'event_id'},
    { 'name' : 'eventDetailsEvent_name', 'value' : false, 'lable' : 'Event name'  ,'variable_name' :  'event_name'},
    { 'name' : 'eventDetailsEvent_start', 'value' : false, 'lable' : 'Event start' ,'variable_name' :  'event_start' },
    { 'name' : 'eventDetailsEvent_end', 'value' : false, 'lable' : 'Event end'  ,'variable_name' :  'event_end'},
  ];

  Liorder_details:any = false;
  LiOrderDetails  = [
    { 'name' : 'orderDetails_id', 'value' : false, 'lable' : 'Order ID','variable_name' :  'order_id'},
    { 'name' : 'orderDetails_date', 'value' : false, 'lable' : 'Order date','variable_name' :  'order_date'},
    { 'name' : 'orderDetailsTotal_paid', 'value' : false, 'lable' : 'Total paid','variable_name' :  'total_paid'},
    { 'name' : 'orderDetailspayment_method', 'value' : false, 'lable' : 'Payment method' ,'variable_name' :  'payment_method'},
    { 'name' : 'orderDetailstransaction_id', 'value' : false, 'lable' : 'Transaction ID' ,'variable_name' :  'transaction_id'},
    { 'name' : 'orderDetailsReferral_tag', 'value' : false, 'lable' : 'Referral Tag' ,'variable_name' :  'refrel_tag'},
    { 'name' : 'orderDetailsDiscount_code', 'value' : false, 'lable' : 'Discount code' ,'variable_name' :  'discount_code'},
    { 'name' : 'orderDetails_cancel', 'value' : false, 'lable' : 'Order cancelled' ,'variable_name' :  'order_canceled'},
    { 'name' : 'taxes ', 'value' : false, 'lable' : 'Taxes' ,'variable_name' :  'tax_amount'},
  ];


  Liticketdetail:any = false;
  ticketDetails  = [
    { 'name' : 'tickets', 'value' : false, 'lable' : 'Tickets','variable_name' :  'tickets'},
    { 'name' : 'voided_tickets', 'value' : false, 'lable' : 'Voided tickets' ,'variable_name' :  'voided_tickets'},
    { 'name' : 'transaction_fee', 'value' : false, 'lable' : 'Transaction charges' ,'variable_name' :  'ticket_charges'},
    { 'name' : 'taxes', 'value' : false, 'lable' : 'Taxes' ,'variable_name' :  'taxes'},
  ];
  
  lineitem_details:any = false;
  lineitemDetail  = [
    { 'name' : 'line_type', 'value' : false, 'lable' : 'Type','variable_name' :  'type'},
    { 'name' : 'line_description', 'value' : false, 'lable' : 'Description' ,'variable_name' :  'description'},
    { 'name' : 'line_value', 'value' : false, 'lable' : 'Value' ,'variable_name' :  'value'},
    { 'name' : 'linebooking_fee', 'value' : false, 'lable' : 'Booking fee' ,'variable_name' :  'booking_fee'},
  ];

  lineitemType  = [
    { 'name' : 'lineitem_ticket', 'value' : false, 'lable' : 'Tickets','variable_name' :  'tickets'},
    { 'name' : 'lineitem_voidticket', 'value' : false, 'lable' : 'Voided tickets' ,'variable_name' :  'voided_tickets'},
    { 'name' : 'lineitem_transactioncharge', 'value' : false, 'lable' : 'Transaction charges' ,'variable_name' :  'transaction_fee'},
    { 'name' : 'lineitem_taxes', 'value' : false, 'lable' : 'Taxes' ,'variable_name' :  'taxes'},
    { 'name' : 'lineitem_giftcard', 'value' : false, 'lable' : 'Gift cards' ,'variable_name' :  'gift_cards'},
    { 'name' : 'lineitem_donation', 'value' : false, 'lable' : 'Donations' ,'variable_name' :  'donations'},
  ];

/////////////////////////////////////

  ExorderDetails  = [
    { 'name' : 'orderDetails_id', 'value' : false, 'lable' : 'Order ID','variable_name' :  'order_id'},
    { 'name' : 'orderDetailsticket_check', 'value' : false, 'lable' : 'Tickets checked in' ,'variable_name' :  'tickets_checked_in'},
    { 'name' : 'orderDetailOrder_cancel', 'value' : false, 'lable' : 'Order cancelled' ,'variable_name' :  'order_canceled'},
    { 'name' : 'orderDetailOrder_date', 'value' : false, 'lable' : 'Order date' ,'variable_name' :  'order_date'},
    { 'name' : 'orderDetailTax_amount', 'value' : false, 'lable' : 'Tax amount' ,'variable_name' :  'tax_amount'},
    { 'name' : 'orderDetailVoucher_code', 'value' : false, 'lable' : 'Voucher codes amount' ,'variable_name' :  'voucher_code_amt'},
    { 'name' : 'orderDetailTicket_charge', 'value' : false, 'lable' : 'Ticket charges' ,'variable_name' :  'ticket_charges'},
  ];

  exEventDetails  = [
    { 'name' : 'eventDetailsEvent_id', 'value' : false, 'lable' : 'Event ID'  ,'variable_name' :  'event_id'},
    { 'name' : 'eventDetailsEvent_name', 'value' : false, 'lable' : 'Event name'  ,'variable_name' :  'event_name'},
    { 'name' : 'eventDetailsEvent_start', 'value' : false, 'lable' : 'Event start' ,'variable_name' :  'event_start' },
    { 'name' : 'eventDetailsEvent_end', 'value' : false, 'lable' : 'Event end'  ,'variable_name' :  'event_end'},
  ];

  
  exBuyerDetails  = [
    { 'name' : 'buyerDetailsFirstname', 'value' : false, 'lable' : 'FirstName','variable_name' :  'firstname' },
    { 'name' : 'buyerDetailsLastname', 'value' : false, 'lable' : 'lastName','variable_name' :  'lastname'},
    { 'name' : 'buyerDetailsemail', 'value' : false, 'lable' : 'Email' ,'variable_name' :  'email'},
    { 'name' : 'buyerDetailsPhone', 'value' : false, 'lable' : 'Mobile number' ,'variable_name' :  'mobile'},
    { 'name' : 'buyerDetailsAddress1', 'value' : false, 'lable' : 'Address' ,'variable_name' :  'address1'},
    { 'name' : 'buyerDetailsPostcode', 'value' : false, 'lable' : 'Postcode / Zip' ,'variable_name' :  'zip'},
  ];

  constructor(
    public dialogRef: MatDialogRef<ExportOrderDialog>,
    private http: HttpClient,
    public superadminService : SuperadminService,
    private ErrorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
      this.orderuniqueCode = localStorage.getItem('selectedEventCode')
     
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }
  
  fnExportOrderType(event){
    this.reportType=event.value
  }


  fnOrdersDetails(event,checkBoxType){

    if(checkBoxType == 'main'){

        event.checked == true ? this.orderDetails = true  : this.orderDetails = false;

        this.ExorderDetails.forEach(element => {
          element.value = event.checked;
        });
    
    }else{

      var i = 0;

      this.ExorderDetails.forEach(element => {
          if(element.value){
            i++
          }
      });

      if(i == 7){
        this.orderDetails = true;
      }else{
        this.orderDetails = false;
      }
      
    }
    

  }

  //overview report event details

  fnEventDetails(event,checkBoxType){
    
    if(checkBoxType == 'main'){

      event.checked == true ? this.eventDetails = true  : this.eventDetails = false;

      this.exEventDetails.forEach(element => {
        element.value = event.checked;
      });
  
    }else{

      var i = 0;
      this.exEventDetails.forEach(element => {
          
        if(element.value){
            i++
          }

          i == 4 ? this.eventDetails = true : this.eventDetails = false ;
      });
    
    }

  }

  //overview report buyers details

  fnBuyersDetails(event,checkBoxType){
      
    if(checkBoxType == 'main'){

      event.checked == true ? this.buyerDetails = true  : this.buyerDetails = false;

      this.exBuyerDetails.forEach(element => {
        element.value = event.checked;
      });
  
    }else{

      var i = 0;
      this.exBuyerDetails.forEach(element => {
        if(element.value){
          i++
        }
        i == 6 ? this.buyerDetails = true : this.buyerDetails = false ;
      });
    }

  }

  /////////////////////////

  fnLineitem_details(event,checkBoxType){

    if(checkBoxType == 'main'){

      event.checked == true ? this.lineitem_details = true  : this.lineitem_details = false;
      this.lineitemDetail.forEach(element => {
        element.value = event.checked;
      });

    }else{

      var i = 0;
      this.lineitemDetail.forEach(element => {
        if(element.value){
          i++
        }
        i == 4 ? this.lineitem_details = true : this.lineitem_details = false ;
      });

    }

  }
  
 
  fnTicket_details(event,checkBoxType){
    if(checkBoxType == 'main'){

      event.checked == true ? this.Liticketdetail = true  : this.Liticketdetail = false;
      this.ticketDetails.forEach(element => {
        element.value = event.checked;
      });

    }else{

      var i = 0;
      this.ticketDetails.forEach(element => {
        if(element.value){
          i++
        }
        i == 4 ? this.Liticketdetail = true : this.Liticketdetail = false ;
      });

    }

  }

  fnLiOrdersDetails(event,checkBoxType){

    if(checkBoxType == 'main'){

      event.checked == true ? this.Liorder_details = true  : this.Liorder_details = false;
      this.LiOrderDetails.forEach(element => {
        element.value = event.checked;
      });

    }else{

      var i = 0;
      this.LiOrderDetails.forEach(element => {
        if(element.value){
          i++
        }
        i == 9 ? this.Liorder_details = true : this.Liorder_details = false ;
      });
    }

  }

  fnLiEventDetailsEvent(event,checkBoxType){
    if(checkBoxType == 'main'){
      event.checked == true ? this.LiEvent_detail = true  : this.LiEvent_detail = false;
      this.LiEventDetails.forEach(element => {
        element.value = event.checked;
      });
    }else{
      var i = 0;
      this.LiEventDetails.forEach(element => {
        if(element.value){
          i++
        }
        i == 4 ? this.LiEvent_detail = true : this.LiEvent_detail = false ;
      });
    }
  }

  fnLiBuyersDetails(event,checkBoxType){
      
    if(checkBoxType == 'main'){

      event.checked == true ? this.LiBuyerDetail = true  : this.LiBuyerDetail = false;

      this.LiBuyerDetails.forEach(element => {
        element.value = event.checked;
      });
  
    }else{

      var i = 0;
      this.LiBuyerDetails.forEach(element => {
        if(element.value){
          i++
        }
        i == 6 ? this.LiBuyerDetail = true : this.LiBuyerDetail = false ;
      });
    }

  }

  exportOrder(){

    this.isLoaderAdmin = true;

    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'Export Orders',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename : 'export_order',
    };
    const csvExporter = new ExportToCsv(options);
    // this.buyerArray=this.buyerFieldList.concat('unique_code');
    // this.orderArray=this.orderFieldList.concat('unique_code').concat('customer_id');
    // this.eventArray= this.eventFieldList.concat('unique_code');

    if(this.reportType=="overview"){

          let requestObject = {
            "boxoffice_id" : this.boxOfficeCode,
            "report_type": "O" ,
            "buyer_details":  this.buyerDetails ? 'Y' : "N",
            "order_details":this.orderDetails ? 'Y' : "N",
            "event_details": this.eventDetails ? 'Y' : "N",
          
            "address2" : 'N',
            "address3" : 'N',
            "booking_fee" : "N",
            "description" : "N",
            "discount_code" : "N",
            "donations" : "N",
            "gift_cards" : "N",
            "payment_method" : "N",
            "refrel_tag" : "N",
            "taxes" : "N",
            "tickets" : "N",
            "total_paid" : "N",
            "transaction_fee" : "N",
            "transaction_id" : "N",
            "type" : "N",
            "value" : "N",
            "voided_tickets" : "N",
          };

          this.ExorderDetails.forEach((element,key,obj) => {
            requestObject[element.variable_name] = element.value ? 'Y' : 'N';
          });

          this.exEventDetails.forEach((element,key,obj) => {
            requestObject[element.variable_name] = element.value ? 'Y' : 'N';
          });

          this.exBuyerDetails.forEach((element,key,obj) => {
            requestObject[element.variable_name] = element.value ? 'Y' : 'N';
          });


          this.superadminService.fnExportOrders(requestObject).subscribe((response:any)=>{
            this.isLoaderAdmin = false;

            if(response.data == true && response.response!='Orders not found.'){   
              this.selectedOrderArr = response.response;
              csvExporter.generateCsv(this.selectedOrderArr);
              this.ErrorService.successMessage("orders exported successfully");
            }else{
              this.ErrorService.errorMessage(response.response);
            }
        });

    }

    if(this.reportType=="lineItem"){
      
      let requestObject = {
        "boxoffice_id" : this.boxOfficeCode,
        "report_type": "L",

        // 'lineitem_details'  : this.lineitem_details ? 'Y' : 'N',
        // 'ticket_details'  : this.Liticketdetail ? 'Y' : 'N',
        
        "buyer_details":  this.LiBuyerDetail ? 'Y' : "N",
        "order_details":this.Liorder_details ? 'Y' : "N",
        "event_details": this.LiEvent_detail ? 'Y' : "N",
        "address2" : 'N',
        "address3" : 'N',
        "tickets_checked_in" : "N",
        "voucher_code_amt" : "N"
      };
      
      this.lineitemType.forEach((element,key,obj) => {
        requestObject[element.variable_name] = element.value ? 'Y' : 'N';
      });

      this.lineitemDetail.forEach((element,key,obj) => {
        requestObject[element.variable_name] = element.value ? 'Y' : 'N';
      });

      this.ticketDetails.forEach((element,key,obj) => {
        requestObject[element.variable_name] = element.value ? 'Y' : 'N';
      });
      
      this.LiOrderDetails.forEach((element,key,obj) => {
        requestObject[element.variable_name] = element.value ? 'Y' : 'N';
      });

      this.LiEventDetails.forEach((element,key,obj) => {
        requestObject[element.variable_name] = element.value ? 'Y' : 'N';
      });

      this.LiBuyerDetails.forEach((element,key,obj) => {
        requestObject[element.variable_name] = element.value ? 'Y' : 'N';
      });
     

      this.superadminService.fnExportOrders(requestObject).subscribe((response:any)=>{
        this.isLoaderAdmin = false;

        if(response.data == true && response.response!='Orders not found.'){   
          this.selectedOrderArr = response.response;
          csvExporter.generateCsv(this.selectedOrderArr);
          this.ErrorService.successMessage("orders exported successfully");
        }else{
          this.ErrorService.errorMessage(response.response);
        }
      });
      
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

  fnBookTicketType(selecetedEvent,singleEventData){
    this.selectedEvent = selecetedEvent;
    this.bookTicket(singleEventData);
  }
  
  fnGetAllEventList(){
    
    let requestObject={
      "boxoffice_id": this.boxOfficeCode,
      "filter":'all',
    }

    this.superadminService.getAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        
        this.allEventlist = response.response;

        this.allEventlist.forEach((element,index,object) => {

          var status = element.event_status;
          var endDate = element.end_date +' '+ element.end_time;

          if(status == 'draft'){
            object.splice(index, 1);
          }

          var lastDate: Date = new Date(endDate);
          var currentDate: Date = new Date();

          if( currentDate > lastDate  ){
            object.splice(index, 1);
            //return false;
          } else {
            //return true;
          }

      });

      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
  }

  bookTicket(singleEventData) {
    const dialogRef = this.dialog.open(BookTicketDialog, {
      width: '700px',
      data :{selecetedEvent : this.selectedEvent,'singleEventData' : singleEventData}
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
  subTotal :any = 0;
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
  eventDetail:any = [];
  eventSettings:any = [];
  donation_amt = 0;
  transaction_fee = 0;
  currencySymbol = "USD";
  total_sales_tax = 0;
  event_tickets:any = [];
  voucher_code:any = '';
  voucher_amt = 0;
  promo_code ="";
  grandTotal = 0;
  total_sales_tax_amount = 0;
  coupon_code = '';
  coupon_amt = 0;
  gloabelSalesTax = 0;
  discount_amt = 0;
  attendeeForm:any = [];
  formArr:any = [];
  dynamicForm: FormGroup;
  attendeeFormLength = 0;
  addressStyleArry:any;
  addressArr = {
    'address': 'Address Line 1',
    'address1': 'City',
    'address2': 'State',
    'zipcode': 'Zip Code',
  };
  is_address_hide = false;

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
      this.eventDetail = this.data.singleEventData;
      
      this.eventSettings = this.eventDetail.event_setting;
      this.donation_amt = this.eventSettings.donation_amt ? parseInt(this.eventSettings.donation_amt) : 0;
      this.transaction_fee =  this.eventSettings.transaction_fee ? parseInt(this.eventSettings.transaction_fee) : 0;
      if(this.eventSettings.currency){
        this.currencySymbol = this.eventSettings.currency;
      }

      let sales_tax = JSON.parse(this.eventSettings.sales_tax);

      sales_tax.forEach(element => {
        if(parseInt(element.amount) > 0){
          this.total_sales_tax = this.total_sales_tax + parseInt(element.amount);
        }
      });


      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
      }
      let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      this.bookTickets = this._formBuilder.group({
        name:["", Validators.required],
        email:["", [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
        address:["", Validators.required],
        address1:["", Validators.required],
        address2:["", Validators.required],
        zipcode:["", [Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(5),Validators.maxLength(6)]],
        phone:['',[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
      });

      this.dynamicForm = this._formBuilder.group({
        tickets: new FormArray([])
      });

  }

 

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.fnGeteventTicket();
    this.getEventForm();
    this.fnGetSalesTax();
  }

  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.tickets as FormArray; }

  fnGetSalesTax(){
    
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id' : this.boxOfficeCode,
    }

    this.superadminService.getAllAddTax(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.gloabelSalesTax = response.response;

        response.response.forEach(element => {
          this.gloabelSalesTax = this.gloabelSalesTax +  parseInt(element.value);
        });

        
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }

  getEventForm(){

    this.isLoaderAdmin = true;
    let requestObject = {
      'event_id' : this.selectedEventCode,
      'option_key' : 'checkout_form_type',
      'boxoffice_id' : 'NULL'
    }

    this.superadminService.getSingleEventSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){

        var checkout_form_type =  JSON.parse(response.response); 

          if(checkout_form_type == 'global'){
            let arrgumentObject = {
              'event_id' : 'NULL',
              'option_key' : 'checkout_form',
              'boxoffice_id' : this.boxOfficeCode
            }
            this.getCheckoutForm(arrgumentObject);
          }else{
            let arrgumentObject = {
              'event_id' : this.selectedEventCode,
              'option_key' : 'checkout_form',
              'boxoffice_id' : 'NULL'
            }
           this.getCheckoutForm(arrgumentObject);
          }
         
      } else if(response.data == false){
        this.eventForm = [];
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });


  }


  getCheckoutForm(requestObject){

    this.isLoaderAdmin = true;

    this.superadminService.getSingleEventSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
        
        
        var data =   JSON.parse(response.response);
        this.attendeeForm = data[0].attendee_questions;
        this.eventForm = data[0].buyer_questions;
        
        this.attendeeFormLength = this.attendeeForm.length;

        
        if(this.eventForm[2] && this.eventForm[2].is_deleted == true){
          this.is_address_hide = true;
        
          this.bookTickets.controls["address"].setValidators(null);
          this.bookTickets.controls["address1"].setValidators(null);
          this.bookTickets.controls["address2"].setValidators(null);
          this.bookTickets.controls["zipcode"].setValidators(null);

          this.bookTickets.controls["address"].setValue(null);
          this.bookTickets.controls["address1"].setValue(null);
          this.bookTickets.controls["address2"].setValue(null);
          this.bookTickets.controls["zipcode"].setValue(null);

        }

        if(this.eventForm[2].addressForamteStyle == 'UK'){
          
          this.addressArr = {
            'address': 'Address Line 1',
            'address1': 'Address Line 2',
            'address2': 'Address Line 3',
            'zipcode': 'Zip Code',
          };

        }else if(this.eventForm[2].addressForamteStyle == 'Cadadian'){

          this.addressArr = {
            'address': 'Address Line 1',
            'address1': 'City',
            'address2': 'Province',
            'zipcode': 'Postal Code',
          };

        }

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
        
        this.formArr = [];
        this.attendeeForm.forEach(element => {
          if(element.type=='checkbox'){
            element.selector = this.CheckBoxArr(element.options);
          }

          var required = element.required ? Validators.required : null;
          
          this.formArr[element.label.replace(/[^a-zA-Z]/g, '')] = ['',required];
          element.controlname = element.label.replace(/[^a-zA-Z]/g, '');
          element.value = '';
        });

        
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
          this.event_tickets.push(element.unique_code)
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


    if( single_event.min_per_order  == null && single_event.max_per_order ==  '' ){
      this.eventTicket[index].is_added = true;
    }else if( parseInt(single_event.min_per_order)  >  parseInt(single_event.qty)  ){
      this.eventTicket[index].qty = single_event.min_per_order;
      this.ErrorService.errorMessage('Minimun Quantity  shoulde be '+single_event.min_per_order);

    } else if( parseInt(single_event.qty) > parseInt(single_event.max_per_order) ){

      this.eventTicket[index].qty = single_event.max_per_order;
      this.ErrorService.errorMessage('Maximun Quantity shoulde be '+single_event.max_per_order);
    }
    this.total_qty = 0;
    
    if(true == is_update){
      this.subTotal = 0;
     
      this.eventTicket.forEach(element=>{
        if(parseInt(element.qty)  > 0 && element.id_added == true){
          this.is_added_at_least_item = false;
          var total = parseInt(element.qty) * parseFloat(element.prize);
          this.subTotal = this.subTotal + total + parseFloat(element.booking_fee);
          this.total_qty = this.total_qty +  parseInt(element.qty);
        }
      });
    }
    

    if(this.total_sales_tax  > 0){
      this.total_sales_tax_amount = this.subTotal*this.total_sales_tax/100;
    }else if(this.gloabelSalesTax > 0){
      this.total_sales_tax_amount = this.subTotal*this.gloabelSalesTax/100;
    }

    this.grandTotal = this.subTotal+this.total_sales_tax_amount+this.transaction_fee;

    
  }

  fnAddDiscount(){
    

    this.isLoaderAdmin = true;
    let requestObject = {
      'event_id' : this.selectedEventCode,
      'code' : this.promo_code,
      'tickets_id' : this.event_tickets.join(','),
      'boxoffice_id': this.boxOfficeCode,
    }
    
    this.superadminService.getVoucherCode(requestObject).subscribe((response:any) => {
      if(response.data == true){

        var Data =  response.response;

        if(Data.type == 'voucher'){

          this.voucher_code = this.promo_code;
          this.voucher_amt = parseInt(Data.voucher_value);
          
          if(this.voucher_amt >= this.grandTotal ){
            this.voucher_amt = this.grandTotal;
          }
          this.discount_amt = this.voucher_amt;
          this.grandTotal = this.grandTotal - this.voucher_amt;

        }else{
        
          this.coupon_amt = 0;
          this.coupon_code = this.promo_code;

          if(Data.discount_type == 'P'){
            this.coupon_amt = this.subTotal * parseInt(Data.discount) / 100;
          }else{
            this.coupon_amt = parseInt(Data.discount);
          }
          
          if(this.coupon_amt >= this.grandTotal ){
            this.coupon_amt = this.grandTotal;
          }
          this.discount_amt = this.coupon_amt;
          this.grandTotal = this.grandTotal - this.coupon_amt;
        }
        

      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }

   fnSum(qty,prize,booking_fee){
      return (parseInt(qty)*parseInt(prize))+parseInt(booking_fee);
   }

  async  fnTicketCheckout(fromType){
    
   
    if(fromType=='CheckoutForm'){
      this.addOrderFormType  = fromType;

      this.dynamicForm = this._formBuilder.group({
        tickets: new FormArray([])
      });
      //this.t.patchValue([]);
      for(var i=0; i<this.total_qty; i++){
        this.t.push(this._formBuilder.group(this.formArr));
      }
  
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
      this.bookTickets.get('address1').markAsTouched();
      this.bookTickets.get('address2').markAsTouched();
      this.bookTickets.get('zipcode').markAsTouched();
      this.ErrorService.errorMessage('please fill out required fields.');
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
      this.ErrorService.errorMessage('please fill out required fields.');
      return false;
    }

    if(this.dynamicForm.invalid){
      return  this.ErrorService.errorMessage('please fill out required field.');
    }
    
    var VALUES = [];
    this.dynamicForm.value.tickets.forEach((value, key, obj) => {
      var attendeeFormArr = [];
      attendeeFormArr = this.attendeeForm;
      attendeeFormArr.forEach((element,keys,ooo) => {
        element.value = Object.values(obj[key])[keys];
        var ele = JSON.stringify(element);
        VALUES.push(JSON.parse(ele));
      });
      attendeeFormArr=[]
    });
 
    var attendeeFinalArr = [];
    while(VALUES.length) {
      attendeeFinalArr.push(VALUES.splice(0, this.attendeeFormLength))
    }

    var order_item = [];

    this.eventTicket.forEach(element => {
      if(element.qty > 0){
        for(var j=1; j<=parseInt(element.qty); j++){
          order_item.push({
            'ticket_id' : element.unique_code,
            'qty' : 1,
            'discount_code' : '',
            'amount' : element.prize,
            'tax' : 0,
            'sub_total' :   parseInt(element.prize) ,
            'discount_amt' : 0,
            'grand_total' : parseInt(element.prize) ,
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
    if(this.eventForm[2].addressForamteStyle == 'UK'){
      this.addressStyleArry = {
        "address1" : this.bookTickets.get("address").value,
        "address2" : this.bookTickets.get("address1").value,
        "address3" : this.bookTickets.get("address2").value,
        "zipcode" : this.bookTickets.get("zipcode").value,
        'style' : this.eventForm[2].addressForamteStyle
      }
    }else if(this.eventForm[2].addressForamteStyle == 'US'){
      this.addressStyleArry = {
        "address1" : this.bookTickets.get("address").value,
        "city" : this.bookTickets.get("address1").value,
        "state" : this.bookTickets.get("address2").value,
        "zipcode" : this.bookTickets.get("zipcode").value,
        'style' : this.eventForm[2].addressForamteStyle
      }
    }else if(this.eventForm[2].addressForamteStyle == 'Cadadian'){
      this.addressStyleArry = {
        "address1" : this.bookTickets.get("address").value,
        "city" : this.bookTickets.get("address1").value,
        "province" : this.bookTickets.get("address2").value,
        "postalcode" : this.bookTickets.get("zipcode").value,
        'style' : this.eventForm[2].addressForamteStyle
      }
    }
   
    let requestObject = {
      "box_office_id":this.boxOfficeCode,
      "event_id": this.selectedEventCode,
      "order_date" : todaydate,
      "order_time" : today.getHours()+":"+today.getUTCHours(),
      "qty" : this.total_qty,
      "sub_total" : this.subTotal,
      "tax" : this.total_sales_tax_amount,
      "transaction_fee" : this.transaction_fee,

      "voucher_code" : this.voucher_code,
      "voucher_amt" : this.voucher_amt,
      "coupon_code" : this.coupon_code,
      "coupon_amt" : this.coupon_amt,

      "grand_total" : this.grandTotal,
      "payment_method" : "cash",
      "transaction_id" : this.makeid(16),
      "payment_status" : 'paid',
      "customer_firstname": name[0] ? name[0] : '',
      "customer_lastname": name[1] ? name[1]: '',
      "email":this.bookTickets.get("email").value,
      "phone":this.bookTickets.get("phone").value,
      "address":JSON.stringify(this.addressStyleArry),
      // "address":this.bookTickets.get("address").value,
      // "address1":this.bookTickets.get("address1").value,
      // "address2":this.bookTickets.get("address2").value,
      // "zipcode":this.bookTickets.get("zipcode").value,
      "customer_info" : JSON.stringify( this.eventSpecificForm),
      "attendee_info" : JSON.stringify(attendeeFinalArr),
      'tickets' : order_item
    }

 

    this.isLoaderAdmin = true;

    this.superadminService.createOrder(requestObject).subscribe((response:any) => {
      if(response.data == true){
        
        this.isLoaderAdmin = false;

        this.ErrorService.successMessage('Order created.');
        this.orderDetail = response.response;
        this.dialogRef.close();
        
        this.change.detectChanges();

      }else{
        return  this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
    
    
  }


  // resendOrder(){
  //   this.isLoaderAdmin = true;
  //   this.superadminService.fnResendOrder(this.orderDetail.unique_code).subscribe((response:any)=>{
  //     if(response.data == true){   
  //       this.ErrorService.successMessage(response.response);
  //     }else if(response.data == false){
  //       this.ErrorService.errorMessage(response.response);
  //     }
  //     this.isLoaderAdmin = false;
  //   });
  // }

  // editOrder(){
  //   const dialogRef = this.dialog.open(EditorderDialog, {
  //     width: '700px',
  //     data : this.orderDetail,
  //   });
  
  //    dialogRef.afterClosed().subscribe(result => {
  //     this.animal = result;
  //    });
  // }  


  // fnDownloadTicket(itemId){
  //   window.open(`${environment.apiUrl}/download-single-ticket?unique_code=${itemId}`);
  // }  


  // cancelOrder(){

  //   const dialogRef = this.dialog.open(cancelOrderDialog, {
  //     width: '700px',
  //     data : this.orderDetail,
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //   this.animal = result;
  //   });
  // }  


  // fnDownloadInvoice(orderId) {
  //   alert('1')
  //   window.open(`${environment.apiUrl}/stream-invoice-pdf?order_id=${orderId}`);
  // }  

  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

 
}

@Component({
  selector: 'confirm-payment-received',
  templateUrl: '../_dialogs/confirm-payment-received.html',
})
export class ConfirmpaymentreceivedDialog { 
  
  transaction_id="";
  orderData:any = [];

  constructor(
    public dialogRef: MatDialogRef<ConfirmpaymentreceivedDialog>,
    public superadminService:SuperadminService,
    public errorService:ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.orderData = this.data;

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {


  }

  fnUpdateStatus(){
    
    let requestObject={
      "unique_code": this.data.unique_code,
      "payment_status" :  "paid",
      "transaction_id": this.transaction_id 
    }

    this.superadminService.fnUpdatePaymentStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.errorService.successMessage('Payment status updated.');
        this.dialogRef.close();
      }else{
        this.errorService.successMessage(response.response);
      }
    });
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
  addressArr = {
    'address': 'Address Line 1',
    'address1': 'City',
    'address2': 'State',
    'zipcode': 'Zip Code',
  };
  is_address_hide = false;
  attendeeForm:any =  [];
  addressStyleArry:any;
  customerAddress:any;
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
        address:["", Validators.required],
        address1:["", Validators.required],
        address2:["", Validators.required],
        zipcode:["", [Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(5),Validators.maxLength(6)]],
        phone:['',[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
      });

      
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
    
    ngOnInit() {
      this.fnGetsingleOrder();
      this.getCheckoutFormSettings();
    }

   

    getCheckoutFormSettings(){

      this.isLoaderAdmin = true;
      let requestObject = {
        'event_id' : this.selectedEventCode,
        'option_key' : 'checkout_form_type',
        'boxoffice_id' : 'NULL'
      }

      this.superadminService.getSingleEventSettings(requestObject).subscribe((response:any) => {
        if(response.data == true){

          let checkout_form_type =  JSON.parse(response.response); 

          if(checkout_form_type == 'global'){
            let arrgumentObject = {
              'event_id' : 'NULL',
              'option_key' : 'checkout_form',
              'boxoffice_id' : this.boxoffice_id
            }
            this.getEventForm(arrgumentObject);
          }else{
            let arrgumentObject = {
              'event_id' : this.selectedEventCode,
              'option_key' : 'checkout_form',
              'boxoffice_id' : 'NULL'
            }
            this.getEventForm(arrgumentObject);
          }

        } else if(response.data == false){
          this.errorMessage.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      });

    } 

    getEventForm(requestObject){
     
      this.superadminService.getSingleEventSettings(requestObject).subscribe((response:any) => {
        if(response.data == true){
          var data =   JSON.parse(response.response);
          this.eventForm = data[0].buyer_questions;

          if(this.eventForm[2].is_deleted && this.eventForm[2].is_deleted == true){
            this.is_address_hide = true;
            this.editTicket.controls["address"].setValidators(null);
            this.editTicket.controls["address1"].setValidators(null);
            this.editTicket.controls["address2"].setValidators(null);
            this.editTicket.controls["zipcode"].setValidators(null);

            this.editTicket.controls["address"].setValue(null);
            this.editTicket.controls["address1"].setValue(null);
            this.editTicket.controls["address2"].setValue(null);
            this.editTicket.controls["zipcode"].setValue(null);

          }

          if(this.eventForm[2].addressForamteStyle == 'UK'){
          
            this.addressArr = {
              'address': 'Address Line 1',
              'address1': 'Address Line 2',
              'address2': 'Address Line 3',
              'zipcode': 'Zip Code',
            };
  
          }else if(this.eventForm[2].addressForamteStyle == 'Cadadian'){
  
            this.addressArr = {
              'address': 'Address Line 1',
              'address1': 'City',
              'address2': 'Province',
              'zipcode': 'Postal Code',
            };
  
          }

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
          this.eventSpecificForm =  JSON.parse(this.singleorderCustomer.customer_info);
        
          this.attendeeForm = JSON.parse(this.singleorderCustomer.attendee_info);

          this.editTicket.controls['name'].setValue(this.singleorderCustomer.customer.name)
          this.editTicket.controls['email'].setValue(this.singleorderCustomer.customer.email)
          this.editTicket.controls['phone'].setValue(this.singleorderCustomer.customer.phone)
          if(this.singleorderCustomer.customer.usa_address != null){
            this.customerAddress = JSON.parse(this.singleorderCustomer.customer.usa_address)
            this.customerAddress['style']= 'USA';
            this.editTicket.controls['address'].setValue(this.customerAddress.address1)
            this.editTicket.controls['address1'].setValue(this.customerAddress.city)
            this.editTicket.controls['address2'].setValue(this.customerAddress.state)
            this.editTicket.controls['zipcode'].setValue(this.customerAddress.zipcode)
          }else if(this.singleorderCustomer.customer.uk_address != null){
            this.customerAddress = JSON.parse(this.singleorderCustomer.customer.uk_address)
            this.customerAddress['style']= 'UK';
            this.editTicket.controls['address'].setValue(this.customerAddress.address1)
            this.editTicket.controls['address1'].setValue(this.customerAddress.address2)
            this.editTicket.controls['address2'].setValue(this.customerAddress.address3)
            this.editTicket.controls['zipcode'].setValue(this.customerAddress.zipcode)
          }else if(this.singleorderCustomer.customer.ca_address != null){
            this.customerAddress = JSON.parse(this.singleorderCustomer.customer.ca_address)
            this.customerAddress['style']= 'CA';
            this.editTicket.controls['address'].setValue(this.customerAddress.address1)
            this.editTicket.controls['address1'].setValue(this.customerAddress.city)
            this.editTicket.controls['address2'].setValue(this.customerAddress.province)
            this.editTicket.controls['zipcode'].setValue(this.customerAddress.postalcode)
          }
          
          // this.editTicket.controls['address'].setValue(this.singleorderCustomer.customer.address)
          // this.editTicket.controls['address1'].setValue(this.singleorderCustomer.customer.address1)
          // this.editTicket.controls['address2'].setValue(this.singleorderCustomer.customer.address2)
          // this.editTicket.controls['zipcode'].setValue(this.singleorderCustomer.customer.zipcode)

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
    
    async updateOrder(){

      this.is_submit = true;
      var is_error = false;
  
      if(this.editTicket.invalid){
        this.editTicket.get('name').markAsTouched();
        this.editTicket.get('email').markAsTouched();
        this.editTicket.get('phone').markAsTouched();
        this.editTicket.get('address').markAsTouched();
        this.editTicket.get('address1').markAsTouched();
        this.editTicket.get('address2').markAsTouched();
        this.editTicket.get('zipcode').markAsTouched();
        this.errorMessage.errorMessage('please fill out required fields.');
        return
      }
      
     

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

      await this.attendeeForm.forEach(element => {
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
      if(this.eventForm[2].addressForamteStyle == 'UK'){
        this.addressStyleArry = {
          "address1" : this.editTicket.get("address").value,
          "address2" : this.editTicket.get("address1").value,
          "address3" : this.editTicket.get("address2").value,
          "zipcode" : this.editTicket.get("zipcode").value,
          'style' : this.eventForm[2].addressForamteStyle
        }
      }else if(this.eventForm[2].addressForamteStyle == 'US'){
        this.addressStyleArry = {
          "address1" : this.editTicket.get("address").value,
          "city" : this.editTicket.get("address1").value,
          "state" : this.editTicket.get("address2").value,
          "zipcode" : this.editTicket.get("zipcode").value,
          'style' : this.eventForm[2].addressForamteStyle
        }
      }else if(this.eventForm[2].addressForamteStyle == 'Cadadian'){
        this.addressStyleArry = {
          "address1" : this.editTicket.get("address").value,
          "city" : this.editTicket.get("address1").value,
          "province" : this.editTicket.get("address2").value,
          "postalcode" : this.editTicket.get("zipcode").value,
          'style' : this.eventForm[2].addressForamteStyle
        }
      }

      let requestObject = {
        'event_id' : this.selectedEventCode,
        'boxoffice_id' : this.boxoffice_id,
        'order_id' : this.data.unique_code,
        'firstname' : name[0] ? name[0] : '',
        'lastname' : name[1] ? name[1] : '',
        'phone' : this.editTicket.get("phone").value,
        'email' : this.editTicket.get("email").value,
        'address' : JSON.stringify(this.addressStyleArry),
        // 'address' : this.editTicket.get("address").value,
        // 'address1' : this.editTicket.get("address1").value,
        // 'address2' : this.editTicket.get("address2").value,
        // 'zipcode' : this.editTicket.get("zipcode").value,
        "customer_info" : JSON.stringify(this.eventSpecificForm),
        'attendee_info' : JSON.stringify(this.attendeeForm)
      }

      this.isLoaderAdmin = true;

      this.superadminService.orderUpdate(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.errorMessage.successMessage(response.response);
          this.dialogRef.close();

        } else if(response.data == false){
          this.errorMessage.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      });

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
  providers: [DatePipe]
})
export class eventSummaryDialog { 
  singleorderCustomer:any;
  animal :any;
 // eventTicket:any;
  selectedEventCode:any;
  orderDetail:any =  [];
  orderDate:any;
  eventDate:any;
  order_item_data:any = [];
  customerData:any = [];
  isLoaderAdmin = false;
  is_show = false;
  // currencyCode ='USD';  
  attendeeData:any = [];
  customerAddress : any;
  Orderdata:any;
  subPermission:any;
  constructor(
    public dialogRef: MatDialogRef<eventSummaryDialog>,
    private http: HttpClient,
    public dialog: MatDialog,
    public superadminService : SuperadminService,
    public datePipe:DatePipe,
    private errorService:ErrorService,
    private change:ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.Orderdata = this.data.Orderdata
      this.subPermission = this.data.subPermission
      if(this.Orderdata.customer.usa_address != null){
        this.customerAddress = JSON.parse(this.Orderdata.customer.usa_address)
        this.customerAddress['style']= 'USA';
      }else if(this.Orderdata.customer.uk_address != null){
        this.customerAddress = JSON.parse(this.Orderdata.customer.uk_address)
        this.customerAddress['style']= 'UK';
      }else if(this.Orderdata.customer.ca_address != null){
        this.customerAddress = JSON.parse(this.Orderdata.customer.ca_address)
        this.customerAddress['style']= 'CA';
      }

    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    ngOnInit() {
      this.fnGetsingleOrder();
    //  this.fnGeteventTicket();
    }

    cancelOrder(){
      const dialogRef = this.dialog.open(cancelOrderDialog, {
        width: '700px',
        data : this.Orderdata
      });
    
      dialogRef.afterClosed().subscribe(result => {
        this.animal = result;
      });
    }
  
    editOrder(){
      const dialogRef = this.dialog.open(EditorderDialog, {
        width: '700px',
        data : this.Orderdata
      });
    
      dialogRef.afterClosed().subscribe(result => {
        this.animal = result;
      });
    }  


    fnDownloadTicket(itemId){
      window.open(`${environment.apiUrl}/download-single-ticket?unique_code=${itemId}`);
    }  


    fnDownloadInvoice(orderId) {
      window.open(`${environment.apiUrl}/stream-invoice-pdf?order_id=${orderId}`);
    }  

    fnPayementpaid(){

      const dialogRef = this.dialog.open(ConfirmpaymentreceivedDialog, {
        width: '700px',
        data: this.Orderdata
      });
    
      dialogRef.afterClosed().subscribe(result => {
        this.dialogRef.close();
        this.fnGetsingleOrder();
      });

    }

    // orderInvoice() {
    //   // const dialogRef = this.dialog.open(OrderInvoiceDialog, {
    //   //   width: '700px',
    //   // });
    
    //   //  dialogRef.afterClosed().subscribe(result => {
    //   //   this.animal = result;
    //   //  });
    // }  
  
    resendOrder(){
      this.isLoaderAdmin=true;
      this.superadminService.fnResendOrder(this.Orderdata.unique_code).subscribe((response:any)=>{
        if(response.data == true){   
          this.errorService.successMessage(response.response);
        } else if(response.data == false){
          this.errorService.errorMessage(response.response);
        }
        this.isLoaderAdmin=false;
      });
    }

    fnGetsingleOrder(){

      let requestObject={
        "unique_code": this.Orderdata.unique_code,
      } 

      this.superadminService.fnGetsingleOrder(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.orderDetail = response.response;
          this.orderDate  = this.datePipe.transform(new Date(this.orderDetail.created_at),"EEE MMM d, y");
          this.eventDate  = this.datePipe.transform(new Date(this.orderDetail.events.start_date),"EEE MMM d, y");
          this.order_item_data = this.orderDetail.order_item;
          this.customerData = this.orderDetail.customer;
          this.attendeeData  = JSON.parse(response.response.attendee_info);

        }else{
          this.singleorderCustomer  = [];
        }
        this.is_show = true
        this.change.detectChanges();

      });

    }

    // fnGeteventTicket(){
    //   let requestObject={
    //     "event_id":this.selectedEventCode,
    //   }
    //   this.superadminService.fnGeteventTicket(requestObject).subscribe((response:any) => {
    //     if(response.data == true){
    //       this.eventTicket = response.response;
    //       this.eventTicket.forEach(element => {
    //         element.qty = 0;
    //       });
    //     }else{
    //       this.eventTicket = [];
    //     }
    //   });
    // }

 

}

