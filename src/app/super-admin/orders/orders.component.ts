import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

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
  displayedColumns: string[] = ['orderid','status','name','datetime','event','value','action'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
  ) { }
 
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
  constructor(
    public dialogRef: MatDialogRef<ExportOrderDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  fnExportOrderType(event){
    this.reportType=event.value
  }
  
}


@Component({
  selector: 'Add-New-Orders',
  templateUrl: '../_dialogs/add-new-order.html',
})
export class AddNewOrderDialog { 
  animal :any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddNewOrderDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  fnBookTicketType(){
    this.bookTicket();
    this.dialogRef.close();
  }
  
  bookTicket() {
    const dialogRef = this.dialog.open(BookTicketDialog, {
      width: '700px',
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

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BookTicketDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();

  }
  ngOnInit() {
  }

  fnTicketCheckout(fromType){
    this.addOrderFormType = fromType
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



