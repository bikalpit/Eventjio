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
//import * as jspdf from 'jspdf';  
// import html2canvas from 'html2canvas';
// import * as jsPDF from 'jspdf';
//import * jspdf from 'jspdf';
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
  global_search = '';
  EventDetail:any = [];
  Ticket_Type = "all";
  Issued_from:any;
  Issued_to:any;
  Issued_from_date:any;
  Issued_to_date:any;
  
  
  getIssuedTicketApiUrl:any =  `${environment.apiUrl}/get-allboxoffice-event-api`;
  current_page_getIssuedTicket:any;
  first_page_url_getIssuedTicket:any;
  last_page_getIssuedTicket:any;
  last_page_url_getIssuedTicket:any;
  next_page_url_getIssuedTicket:any;
  prev_page_url_getIssuedTicket:any;
  path_getIssuedTicket:any;

  // displayedColumns: string[] = ['Ticket_Code','Ticket_Type','name','Orderid','Issued',];
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  

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
  }

  // orderData = [{Ticket_Code:'5h92H',Ticket_Type:'General Admission',name:'Shabnam Ansari',Orderid:'10771307',Issued:'Jul 22, 2020'},
  //              {Ticket_Code:'5h92H',Ticket_Type:'General Admission',name:'Shabnam Ansari',Orderid:'10771307',Issued:'Jul 22, 2020'},]

  ngOnInit(): void {
    this.fnGetEventDetail();
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

  issuedTickets(){
   
    let requestObject = {
      "event_id": this.event_id,
      "ticket_type": this.Ticket_Type,
      "issued_status": this.status_ticket,
      "global_search": this.global_search,
      "issued_fromdate": this.Issued_from_date,
      "issued_todate": this.Issued_to_date,
    }

    this.SingleEventServiceService.issuedTickets(requestObject,this.path_getIssuedTicket).subscribe((response:any)=>{
      if(response.data == true){
        //this.getIssuedTicket = response.response;

        this.getIssuedTicket = response.response.data;
        this.current_page_getIssuedTicket = response.response.current_page;
        this.first_page_url_getIssuedTicket = response.response.first_page_url;
        this.last_page_getIssuedTicket = response.response.last_page;
        this.last_page_url_getIssuedTicket = response.response.last_page_url;
        this.next_page_url_getIssuedTicket = response.response.next_page_url;
        this.prev_page_url_getIssuedTicket = response.response.prev_page_url;
        this.path_getIssuedTicket = response.response.path;
        console.log(this.getIssuedTicket);

      } else if(response.data == false){
        this.getIssuedTicket = [];
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
    this.ticketTypeView = ticketview;
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

  fnVoidOrdertView() {
    const dialogRef = this.dialog.open(VoidOrderViewComponent, {
      width: '900px',
      
    });
    this.dialogRef.close();

     dialogRef.afterClosed().subscribe(result => {
      this.OrderView = result;
     });
  }

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

  constructor( 
    public dialogRef: MatDialogRef<OrderViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    public singleEventServiceService:SingleEventServiceService,
    private ErrorService:ErrorService,
    private datePipe: DatePipe,
    ){
      this.orderDetail = this.data.data;
      this.eventDetail = this.data.eventDetail;
      this.currencycode = this.eventDetail.event_setting.currency ? this.eventDetail.event_setting.currency: 'USD';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
  }

  dateFormate(date){
    return this.datePipe.transform(new Date(date),"EEE MMM d, y, h:mm:ss");
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

// ---------------------------------  Void Order View ---------------------------------------------

@Component({
  selector: 'app-void-order-view',
  templateUrl: '../_dialogs/void-order-view.html',
})
export class VoidOrderViewComponent {

  constructor( public dialogRef: MatDialogRef<VoidOrderViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){

  }
}