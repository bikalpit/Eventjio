import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { AuthenticationService } from '../../_services/authentication.service';
import { ErrorService } from '../../_services/error.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperadminService } from '../_services/superadmin.service';

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
  bookTickets: FormGroup;
  onlynumeric = /^-?(0|[1-9]\d*)?$/;
  discount:any;
  allEventlist:any;
  selectedEventCode:any;
  totalCost:any;
  customer_data:any;
  event_id:any;
  boxOfficeCode:any;
  selectedEventDate:any;
  ticket = { "price": 5000, "qty":0,"fee":200};

  calculate() : any {
    return this.ticket.price * this.ticket.qty;
}

grandtotal() :any{
  return this.ticket.fee + this.calculate();
}

// onChange(selectedValue):any{

//   if (selectedValue == 'flat') {
//     this.totalCost = this.discount;
//   } else if (selectedValue == 'percent') {
//     this.totalCost =((this. calculate()* this.discount) / 100); 
//   }
// }

  packagesArray:any = [
      {  'ticket_type': 'General Admission' },  
  ];
      
     
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BookTicketDialog>,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    public superadminService : SuperadminService,
    private authenticationService : AuthenticationService,
    private ErrorService : ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

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
        address_2:["", Validators.required],
        address_3:["", Validators.required],
        postcode:["", [Validators.required, Validators.pattern(this.onlynumeric)]],
        attendee_name:["", Validators.required],
        promo_code:["",[Validators.minLength(6),Validators.maxLength(6)]],
      });
    }
    
    

  onNoClick(): void {
    this.dialogRef.close();

  }
  ngOnInit() {
    this.fnGetAllEventList();
}

fnGetAllEventList(){
  let requestObject={
    "boxoffice_id": this.boxOfficeCode,
    "filter":'upcoming',
  }
  this.superadminService.fnGetAllEventList(requestObject).subscribe((response:any) => {
    if(response.data == true){
      alert(1);
      this.allEventlist = response.response
      console.log(this.allEventlist);
      this.selectedEventCode=  this.allEventlist[0].event_id
     console.log(this.selectedEventCode);
    }else{
      alert(2)
    }
   });
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
      "event_id": this.event_id,
      "ticket_id":this.event_id,
      "qty":this.ticket.qty,
      "sub_total":this.calculate(),
      "order_date":"2020-10-01",
      "order_time":"04:37",
      "grand_total":this.grandtotal(),
      "attendee_name":this.bookTickets.get('attendee_name').value,
      "payment_status":"unpaid",
      "payment_method":"cash",
      
    }
    this.superadminService.createOrder(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
 
      }else{
        alert(2)
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



