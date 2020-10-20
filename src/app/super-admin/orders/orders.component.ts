import { Component, OnInit, ViewChild,Inject } from '@angular/core';
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


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  animal :any;
  allBusiness: any;
  boxOfficeCode:any;
  displayedColumns: string[] = ['orderid','status','name','datetime','event','value','action'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public superadminService : SuperadminService,
    private authenticationService : AuthenticationService,
    private ErrorService : ErrorService,
  ) { 
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
    }
  }
 
orderData = [{orderid:'012345',status:'Completed',name:'Shabnam Ansari',datetime:'Jun 22 2020 04:30pm',event:'Lajavab Cooking Classes ',value:' 5000.00',action:''},
             {orderid:'012345',status:'Void',name:'Shabnam Ansari',datetime:'Jun 22 2020 04:30pm',event:'Lajavab Cooking Classes',value:' 5000.00',action:''},]


  ngOnInit(): void {

  }

  
 exportOredr() {
  const dialogRef = this.dialog.open(ExportOrderDialog, {
    width: '600px',
  });

   dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
   });
  
}

addNewOredr() {
  const dialogRef = this.dialog.open(AddNewOrderDialog, {
    width: '600px',
  });

   dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
   });
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

  // fnAddOrderFields(event, fieldName){
  //   if(event.checked == true){
  //     this.orderFieldList.push(fieldName)
  //   }else{
  //     const index = this.orderFieldList.indexOf(fieldName, 0);
  //     if (index > -1) {
  //         this.orderFieldList.splice(index, 1);
  //     }
  //   }
  // }

  // fnExportevent(event, fieldName){
  //   if(event.checked == true){
  //     this.eventFieldList.push(fieldName)
  //   }else{
  //     const index = this.eventFieldList.indexOf(fieldName, 0);
  //     if (index > -1) {
  //    this.eventFieldList.splice(index, 1);
  //     }
  //   }
  // }

  // fnBuyerSubcomponentdetail(event, buyerdetails){
  //   if(event.checked == true){
  //     this.buyerFieldList.push(buyerdetails)
  //   }else{
  //     const index = this.buyerFieldList.indexOf(buyerdetails, 0);
  //     if (index > -1) {
  //    this.buyerFieldList.splice(index, 1);
  //     }
  //   }
  // }

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
    "boxoffice_id":'box16014425204331',
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
    this.selectedEvent = selecetedEvent
    this.bookTicket();
    this.dialogRef.close();
  }
  
  fnGetAllEventList(){
    let requestObject={
      "boxoffice_id": this.boxOfficeCode,
      "filter":'upcoming',
    }
    this.superadminService.fnGetAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
     
        this.allEventlist = response.response
        // console.log(this.allEventlist);
      }else{
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
})
export class BookTicketDialog { 
  addOrderFormType: any ='selectTicket';
  animal :any;
  bookTickets: FormGroup;
  onlynumeric = /^-?(0|[1-9]\d*)?$/;
  discount:any;
  selectedEventCode:any;
  eventTicket:any;
  event_id:any;
  boxOfficeCode:any;
  selecetdTickets : any =[];
  subTotal :any = '0';
//   subTotal() : any {
//     return this.ticketPrice * this.ticket.qty;
// }

// grandtotal() :any{
//   return this.ticketFee + this.subTotal();
// }

// onChange(selectedValue):any{

//   if (selectedValue == 'flat') {
//     this.totalCost = this.discount;
//   } else if (selectedValue == 'percent') {
//     this.totalCost =((this. subTotal()* this.discount) / 100); 
//   }
// }
     
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BookTicketDialog>,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    public superadminService : SuperadminService,
    private authenticationService : AuthenticationService,
    private ErrorService : ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.selectedEventCode = this.data.selecetedEvent;

      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
      }
      let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      this.bookTickets = this._formBuilder.group({
        firstname:["", Validators.required],
        lastname:["", Validators.required],
        email:["", [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
        repeat_email:["", [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
        phone:['',[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
        address_1:["", Validators.required],
        address_2:[""],
        address_3:[""],
        postcode:["", [Validators.required, Validators.pattern(this.onlynumeric)]],
        attendee_name:["", Validators.required],
        promo_code:["",[Validators.minLength(6),Validators.maxLength(6)]],
      });
    }
    
    

  onNoClick(): void {
    this.dialogRef.close();


  }
  ngOnInit() {
    this.fnGeteventTicket();
  }
 
  fnGeteventTicket(){
    let requestObject={
      "event_id":this.selectedEventCode,
    }
    this.superadminService.fnGeteventTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventTicket = response.response;
      }else{
      }
     });
  }

  fnAddQty(index,event){
    console.log(event)

    if(event.key >= this.eventTicket[index].min_per_order){
      this.subTotal = this.subTotal + (this.eventTicket[index].prize * event.key)
    }else{

      event.key = this.eventTicket[index].min_per_order
     this.subTotal = this.subTotal + (this.eventTicket[index].prize * event.key)
    }
    if(event.key <= this.eventTicket[index].max_per_order){
      this.subTotal = this.subTotal + (this.eventTicket[index].prize * event.key)
    }else{

      event.key = this.eventTicket[index].max_per_order
     this.subTotal = this.subTotal + (this.eventTicket[index].prize * event.key)
    }

      console.log(index,event);
      this.eventTicket[index].qty = event.key;

   this.subTotal =0;
   this.eventTicket.forEach(element=>{
   this.subTotal =this.eventTicket[index].prize
  })
  }


  fnBookTicket(event, index){
    if(event.checked){
      this.selecetdTickets.push(index);
    }else{
      const indexArr = this.selecetdTickets.indexOf(index, 0);
      if (indexArr > -1) {
          this.selecetdTickets.splice(indexArr, 1);
      }
    }
    console.log(this.selecetdTickets)
  }
  

  fnTicketCheckout(fromType){
    this.addOrderFormType = fromType;
   if(this.bookTickets.invalid){

   }else{
    let requestObject ={
      "boxoffice_id":this.boxOfficeCode,
      "firstname":this.bookTickets.get("firstname").value,
      "lastname":this.bookTickets.get("lastname").value,
      "email":this.bookTickets.get("email").value,
      "phone":this.bookTickets.get("phone").value,
      "address_1":this.bookTickets.get("address_1").value,
      "postcode":this.bookTickets.get("postcode").value,
      "event_id": this.selectedEventCode,
      "ticket_id":this.event_id,
      "qty":"",
      "sub_total":this.subTotal(),
      "order_date":"2020-10-01",
      "order_time":"04:37",
      // "grand_total":this.grandtotal(),
      "attendee_name":this.bookTickets.get('attendee_name').value,
      "payment_status":"unpaid",
      "payment_method":"cash",
      
    }
    console.log(requestObject);
    this.superadminService.createOrder(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
 
      }else{
      }
     });
   }
  }


  orderInvoice() {
    const dialogRef = this.dialog.open(OrderInvoiceDialog, {
      width: '700px',
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
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



