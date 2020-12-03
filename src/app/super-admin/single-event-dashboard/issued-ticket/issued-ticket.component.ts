import { Component, OnInit,ViewChild, Inject } from '@angular/core';
//import { MatTableDataSource } from '@angular/material/table';
import { DatePipe, DOCUMENT, JsonPipe } from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { environment } from '../../../../environments/environment'
import { eventSummaryDialog } from '../../orders/orders.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import html2canvas from 'html2canvas';
// import { jsPDF } from "jspdf";

@Component({
  selector: 'app-issued-ticket',
  templateUrl: './issued-ticket.component.html',
  styleUrls: ['./issued-ticket.component.scss'],
  providers: [DatePipe]

})
export class IssuedTicketComponent implements OnInit {
  event_ticket:any = [];
  status_ticket: string = 'all';
  selected = -1;
  exportdoorlist:any;
  issuedticketView:any;
  event_id:any;
  getIssuedTicket:any;
  global_search = 'all';
  EventDetail:any = [];
  Ticket_Type = "all";
  Issued_from:any;
  Issued_to:any;
  Issued_from_date:any;
  Issued_to_date:any;
  boxoffice_id:any;
  filter:any = "all";
  
  //getIssuedTicketApiUrl:any =  `${environment.apiUrl}/get-allboxoffice-event-api`;
  current_page_getIssuedTicket:any;
  first_page_url_getIssuedTicket:any;
  last_page_getIssuedTicket:any;
  last_page_url_getIssuedTicket:any;
  next_page_url_getIssuedTicket:any;
  prev_page_url_getIssuedTicket:any;
  path_getIssuedTicket:any =  `${environment.apiUrl}/get-all-issue-ticket`;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private SingleEventServiceService:SingleEventServiceService,
    private ErrorService:ErrorService,
    private datePipe: DatePipe,

  ) { 
    if(localStorage.getItem('selectedEventCode')){
      this.event_id = localStorage.getItem('selectedEventCode')
    }

    this.boxoffice_id = localStorage.getItem('boxoffice_id')
    
  }

 
  ngOnInit(): void {
    this.fnGetEventDetail();
  }
  
  issuedTickets(){
   
    let requestObject = {
      "event_id": this.event_id,
      "ticket_type": this.Ticket_Type,
      "issued_status": this.status_ticket,
      "filter": this.filter,
      "issued_fromdate": this.Issued_from_date,
      "issued_todate": this.Issued_to_date,
      "boxoffice_id" : this.boxoffice_id
    }

    this.SingleEventServiceService.issuedTickets(requestObject,this.path_getIssuedTicket).subscribe((response:any)=>{
      if(response.data == true){

        this.getIssuedTicket = response.response.data;
        this.current_page_getIssuedTicket = response.response.current_page;
        this.first_page_url_getIssuedTicket = response.response.first_page_url;
        this.last_page_getIssuedTicket = response.response.last_page;
        this.last_page_url_getIssuedTicket = response.response.last_page_url;
        this.next_page_url_getIssuedTicket = response.response.next_page_url;
        this.prev_page_url_getIssuedTicket = response.response.prev_page_url;
        this.path_getIssuedTicket = response.response.path;

      } else if(response.data == false){
        this.getIssuedTicket = [];
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  fnExportDoorList() {
    const dialogRef = this.dialog.open(ExportDoorListComponent, {
      width: '900px',
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.exportdoorlist = result;
     });
  }

  fnIssuedTicketView(data) {
    const dialogRef = this.dialog.open(IssuedTicketViewComponent, {
      width: '900px',
      data : data
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.issuedticketView = result;
     });
  }

  onChange(event) {
    this.Ticket_Type = event;
    this.issuedTickets();
  }

  applyFilter(event: any) {
    this.global_search = event.target.value;
    this.issuedTickets();
  }
  
  IssuedfromChange(){
    this.Issued_from_date = this.datePipe.transform(new Date(this.Issued_from),"EEE MMM d, y");
    this.issuedTickets();
  }

  IssuedtoChange(){
    this.Issued_to_date = this.datePipe.transform(new Date(this.Issued_to),"EEE MMM d, y");
    this.issuedTickets();
  }

  fnGetEventDetail() {

    let requestObject = {
      'unique_code': this.event_id,
    }

    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.EventDetail = response.response;
        this.issuedTickets();
      } else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  

  arrayOneTicket(n: number): any[] {
    return Array(n);
  }
    
  navigateToTicket(api_url){
    this.path_getIssuedTicket=api_url;
    if(this.path_getIssuedTicket){
      this.issuedTickets();
    }
  }

  navigateToPageNumberTicket(index){
    this.path_getIssuedTicket = this.path_getIssuedTicket+'?page='+index;
    if(this.path_getIssuedTicket){
      this.issuedTickets();
    }
  }

  dateFormate(date){
   return this.datePipe.transform(new Date(date),"EEE MMM d, y");
  }

}


// ------------------------------------- Export Door List Component ---------------------------------



@Component({
  selector: 'app-export-door-list',
  templateUrl: '../_dialogs/export-door-list.html',
})
export class ExportDoorListComponent {
  constructor(
    public dialogRef: MatDialogRef<ExportDoorListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}


// ------------------------------------- issued ticket view Component ---------------------------------



@Component({
  selector: 'app-issued-ticket-view',
  templateUrl: '../_dialogs/issued-ticket-view.html',
  providers: [DatePipe]
})
export class IssuedTicketViewComponent {
  
  elementType : 'url' | 'canvas' | 'img' = 'url';
  value : string = '';
  ticketTypeView : any = 'normal';
  OrderView:any;
  eventDetail:any;
  today:any;
  isLoaderAdmin=false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<IssuedTicketViewComponent>,
    public singleEventServiceService:SingleEventServiceService,
    private ErrorService:ErrorService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.value = data.ticket_id;
      this.fnGetEventDetail();
      this.today  = this.datePipe.transform(new Date(new Date()),"EEE MMM d, y h:mm a")

    }
  
  ngOnInit() {
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnGetEventDetail(){

    let requestObject = {
      'unique_code' : this.data.event_id,
    }
    
    this.singleEventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventDetail = response.response.event[0];
        console.log(this.eventDetail);

      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  dateFormate(date){
    return this.datePipe.transform(new Date(date),"EEE MMM d, y");
  }

  fnVoidTicket(ticketview){


    if(ticketview=='voidview'){

      if(!confirm('Are you sure?')){
        return false;
      }

      this.isLoaderAdmin = true;
      
      let requestObject = {
        'unique_code':this.value,
      }

      this.singleEventServiceService.singleTicketVoid(requestObject).subscribe((response: any) => {
        if (response.data == true) {
          this.ErrorService.successMessage(response.response);
        } else if (response.data == false) {
          this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
        this.ticketTypeView = ticketview;
      });

    }else{
      this.ticketTypeView = ticketview;
    }


  }

  fnOrdertView() {
    const dialogRef = this.dialog.open(OrderViewComponent, {
      width: '900px',
      data : { data : this.data, 'eventDetail' : this.eventDetail}
    });
    this.dialogRef.close();

     dialogRef.afterClosed().subscribe(result => {
      this.OrderView = result;
     });
  }

  // fnVoidOrdertView() {
  //   const dialogRef = this.dialog.open(VoidOrderViewComponent, {
  //     width: '900px',
      
  //   });
  //   this.dialogRef.close();

  //    dialogRef.afterClosed().subscribe(result => {
  //     this.OrderView = result;
  //    });
  // }

  // public captureScreen()  
  // {  
   
  //   var data = document.getElementById('print-ticket');  
  //   html2canvas(data).then(canvas => {  
  //     // Few necessary setting options  
  //     var imgWidth = 208;   
  //     var pageHeight = 295;    
  //     var imgHeight = canvas.height * imgWidth / canvas.width;  
  //     var heightLeft = imgHeight;  
  
  //     const contentDataURL = canvas.toDataURL('image/png')  
  //     let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
  //     var position = 0;  
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
  //     pdf.save('MYPdf.pdf'); // Generated PDF   
  //   });  
  // }  
 
}


// ---------------------------------  Order View ---------------------------------------------


@Component({
  selector: 'app-order-view',
  templateUrl: '../_dialogs/order-view.html',
  providers: [DatePipe]

})
export class OrderViewComponent {

  eventDetail:any;
  orderDetail:any;
  currencycode:string = 'USD';
  isLoaderAdmin=false;
  url = environment;
  singleOrderDetail:any = [];

  constructor( 
    public dialogRef: MatDialogRef<OrderViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    public singleEventServiceService:SingleEventServiceService,
    private ErrorService:ErrorService,
    private datePipe: DatePipe,
    public dialog: MatDialog,

    ){
      this.orderDetail = this.data.data;
      this.eventDetail = this.data.eventDetail;
      this.currencycode = this.eventDetail.event_setting.currency ? this.eventDetail.event_setting.currency: 'USD';
      
      console.log(this.orderDetail);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
    this.fnGetsingleOrder();
  }

  dateFormate(date){
    return this.datePipe.transform(new Date(date),"EEE MMM d, y, h:mm:ss");
  }

  fnResendTicket() {

    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code':'ss',
    }

    this.singleEventServiceService.ResendTicket(requestObject).subscribe((response: any) => {
      if (response.data == true) {

      } else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }

  fnCancelorder() {

    var x = confirm('are you sure?');
    if(!x){
      return false;
    }

    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code':this.data.data.order_id,
    }

    this.singleEventServiceService.cancelOrders(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.ErrorService.successMessage(response.response)
      } else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }

  fnEditorder(){

     const dialogRef = this.dialog.open(EditIssurorderDialog, {
      width: '900px',
      data : this.singleOrderDetail
    });
    this.dialogRef.close();
    dialogRef.afterClosed().subscribe(result => {
      console.log('sss');
    });

  }

  fnGetsingleOrder(){

    this.isLoaderAdmin = true;

    let requestObject = {
      'unique_code':this.data.data.order_id,
    }

    this.singleEventServiceService.getsingleOrder(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.singleOrderDetail = response.response;
      } else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }

  fnDownloadTicket(){

    this.isLoaderAdmin = true;

    let requestObject = {
      'unique_code':this.data.data.order_id,
    }

    // this.singleEventServiceService.DownloadTicket(requestObject).subscribe((response: any) => {
    //   if (response.data == true) {
     
    //   } else if (response.data == false) {
    //     this.ErrorService.errorMessage(response.response);
    //   }
    //   this.isLoaderAdmin = false;
    // });

  }
  


  // public captureScreen()  
  // {  
  //   var data = document.getElementById('contentToConvert');  
  //   html2canvas(data).then(canvas => {  
  //     // Few necessary setting options  
  //     var imgWidth = 208;   
  //     var pageHeight = 295;    
  //     var imgHeight = canvas.height * imgWidth / canvas.width;  
  //     var heightLeft = imgHeight;  
  
  //     const contentDataURL = canvas.toDataURL('image/png')  
  //     let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
  //     var position = 0;  
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
  //     pdf.save('MYPdf.pdf'); // Generated PDF   
  //   });  
  // }  

}


/// --------- edit order -----
@Component({
  selector: 'edit-order',
  templateUrl: '../_dialogs/edit-order.html',
})
export class EditIssurorderDialog { 
  editTicket: FormGroup;
  onlynumeric = /^-?(0|[1-9]\d*)?$/;
  singleorderCustomer:any;
  isLoaderAdmin = false;
  boxoffice_id = localStorage.getItem('boxoffice_id');

  constructor(
    public dialogRef: MatDialogRef<EditIssurorderDialog>,
    private http: HttpClient,
    public singleEventServiceService : SingleEventServiceService,
    private _formBuilder:FormBuilder,
    private ErrorService:ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.singleorderCustomer = this.data;
      console.log(this.singleorderCustomer);

      let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

      this.editTicket = this._formBuilder.group({
        firstname:[this.singleorderCustomer.customer.firstname, Validators.required],
        lastname:[this.singleorderCustomer.customer.lastname, Validators.required],
        email:[this.singleorderCustomer.customer.email, [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
        repeat_email:[this.singleorderCustomer.customer.email, [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
        phone:[this.singleorderCustomer.customer.phone,[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
        address:[this.singleorderCustomer.customer.address, Validators.required],
        // address_2:[""],
        // address_3:[""],
        // postcode:["", [Validators.required, Validators.pattern(this.onlynumeric)]],
      });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
    
    ngOnInit() {
    }

    updateOrder(){



      if(this.editTicket.invalid){
        this.editTicket.get('firstname').markAsTouched();
        this.editTicket.get('lastname').markAsTouched();
        this.editTicket.get('email').markAsTouched();
        this.editTicket.get('phone').markAsTouched();
        this.editTicket.get('address').markAsTouched();
        return false;
      }

      
      let requestObject = {
        'boxoffice_id' : this.boxoffice_id,
        "order_id": this.singleorderCustomer.unique_code,
        'firstname' : this.editTicket.get('firstname').value,
        'lastname' : this.editTicket.get('lastname').value,
        'email' : this.editTicket.get('email').value,
        'phone' : this.editTicket.get('phone').value,
        'address' : this.editTicket.get('address').value,
        // 'postcode' : this.editTicket.get('postcode').value,
      }

      this.isLoaderAdmin = true;
  
      this.singleEventServiceService.updateOrder(requestObject).subscribe((response: any) => {
        if (response.data == true) {
          this.ErrorService.successMessage(response.response);
        } else if (response.data == false) {
          this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      });
  

    }


}


// ---------------------------------  Void Order View ---------------------------------------------

// @Component({
//   selector: 'app-void-order-view',
//   templateUrl: '../_dialogs/void-order-view.html',
// })
// export class VoidOrderViewComponent {

//   constructor( public dialogRef: MatDialogRef<VoidOrderViewComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any){

//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

//   ngOnInit(){

//   }
// }