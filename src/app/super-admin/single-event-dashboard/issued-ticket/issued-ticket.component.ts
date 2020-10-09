import { Component, OnInit,ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';


@Component({
  selector: 'app-issued-ticket',
  templateUrl: './issued-ticket.component.html',
  styleUrls: ['./issued-ticket.component.scss']
})
export class IssuedTicketComponent implements OnInit {
  event_ticket: string[] = ['Select all','General admission'];
  status_ticket: string[] =['All issued ticket','Valid','Void'];
  selected = -1;
  exportdoorlist:any;
  issuedticketView:any;
  event_id:any;
  getIssuedTicket:any;

  displayedColumns: string[] = ['Ticket_Code','Ticket_Type','name','Orderid','Issued',];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private SingleEventServiceService:SingleEventServiceService,
    private ErrorService:ErrorService,
  ) { 
    if(localStorage.getItem('selectedEventCode')){
      this.event_id = localStorage.getItem('selectedEventCode')
    }
  }

  orderData = [{Ticket_Code:'5h92H',Ticket_Type:'General Admission',name:'Shabnam Ansari',Orderid:'10771307',Issued:'Jul 22, 2020'},
               {Ticket_Code:'5h92H',Ticket_Type:'General Admission',name:'Shabnam Ansari',Orderid:'10771307',Issued:'Jul 22, 2020'},]

  ngOnInit(): void {
  }

  fnExportDoorList() {
    const dialogRef = this.dialog.open(ExportDoorListComponent, {
      width: '900px',
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.exportdoorlist = result;
     });
  }

  fnIssuedTicketView() {
    const dialogRef = this.dialog.open(IssuedTicketViewComponent, {
      width: '900px',
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.issuedticketView = result;
     });
  }

  onChange(event) {
    console.log(event)
  }
    
  issuedTickets(){
    let requestObject ={
      "event_id":this.event_id,
      "ticket_type": this.event_ticket,
      "issued_status":this.status_ticket,
      "global_search":" ",
      "issued_fromdate": " ",
      "issued_todate":" ",
    }
    this.SingleEventServiceService.issuedTickets(requestObject).subscribe((response:any)=>{
      if(response.data == true){
        this.getIssuedTicket = response.response[0];
             
    } else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
    
    });
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
})
export class IssuedTicketViewComponent {
  
  elementType : 'url' | 'canvas' | 'img' = 'url';
  value : string = '5h92H';
  ticketTypeView : any = 'normal';
  OrderView:any;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<IssuedTicketViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fnVoidTicket(ticketview){
    this.ticketTypeView = ticketview;
  }

  fnOrdertView() {
    const dialogRef = this.dialog.open(OrderViewComponent, {
      width: '900px',
      
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

  ngOnInit() {
  }
 
}


// ---------------------------------  Order View ---------------------------------------------


@Component({
  selector: 'app-order-view',
  templateUrl: '../_dialogs/order-view.html',
})
export class OrderViewComponent {

  constructor( public dialogRef: MatDialogRef<OrderViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){

  }
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