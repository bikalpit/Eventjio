import { Component, OnInit,ViewChild, Inject,ChangeDetectorRef } from '@angular/core';
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
import * as moment from 'moment'; 
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
  isLoaderAdmin = false;

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
      "boxoffice_id" : this.boxoffice_id
    }

    if(this.Issued_from_date){ 
      requestObject['issued_fromdate'] = moment(this.Issued_from_date).format('Y-M-D');
    }

    if(this.Issued_to_date){ 
      requestObject['issued_todate'] = moment(this.Issued_to_date).format('Y-M-D');
    }
    
    this.isLoaderAdmin = true;

    this.SingleEventServiceService.issuedTickets(requestObject,this.path_getIssuedTicket).subscribe((response:any)=>{
      if(response.data == true){

        this.getIssuedTicket = response.response.data;
        console.log(this.getIssuedTicket)
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
      this.isLoaderAdmin = false;

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
      this.issuedTickets();
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

        
        this.EventDetail.tickets.forEach((element,index,object) => {
          if(element == null || element =='null'){
            object.splice(index, 1);
          }
        });

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
      this.value = data.unique_code;
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
        'status' : 'VO'
      }

      this.singleEventServiceService.singleTicketVoid(requestObject).subscribe((response: any) => {
        if (response.data == true) {
          this.ErrorService.successMessage(response.response);
          this.dialogRef.close();
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

  public printTicket(data)  
  {  
    window.open(environment.apiUrl+'/download-single-ticket?unique_code='+data.unique_code);
  }  
 
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

    this.singleEventServiceService.ResendTicket(this.orderDetail.order_id).subscribe((response: any) => {
      if (response.data == true) {
        this.ErrorService.successMessage(response.response);
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
      'status' : 'C'
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

  // fnEditorder(){

  //    const dialogRef = this.dialog.open(EditIssurorderDialog, {
  //     width: '900px',
  //     data : this.singleOrderDetail
  //   });
  //   this.dialogRef.close();
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('sss');
  //   });

  // }

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

  fnDownloadTicket(value){
    window.open(environment.apiUrl+'/download-single-ticket?unique_code='+value.unique_code);
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
// @Component({
//   selector: 'edit-order',
//   templateUrl: '../_dialogs/edit-order.html',
// })
// export class EditIssurorderDialog { 

//   editTicket: FormGroup;
//   onlynumeric = /^-?(0|[1-9]\d*)?$/;
//   singleorderCustomer:any;
//   isLoaderAdmin = false;
//   boxoffice_id = localStorage.getItem('boxoffice_id');

//   eventForm:any = [];
//   eventSpecificForm:any = [];
//   selectedEventCode = localStorage.getItem('selectedEventCode');
//   is_submit = false;

//   constructor(
//     public dialogRef: MatDialogRef<EditIssurorderDialog>,
//     private http: HttpClient,
//     public singleEventServiceService : SingleEventServiceService,
//     private _formBuilder:FormBuilder,
//     private ErrorService:ErrorService,
//     public change:ChangeDetectorRef,
//     @Inject(MAT_DIALOG_DATA) public data: any
//     ) {
      
//       // this.singleorderCustomer = this.data;
//       // let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
//       // this.editTicket = this._formBuilder.group({
//       //   name:[this.singleorderCustomer.customer.firstname + this.singleorderCustomer.customer.lastname, Validators.required],
//       //   email:[this.singleorderCustomer.customer.email, [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
//       //   phone:[this.singleorderCustomer.customer.phone,[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
//       //   address:[this.singleorderCustomer.customer.address, Validators.required],
//       // });
//   }


    
//     onNoClick(): void {
//       this.dialogRef.close();
//     }
    
//     // ngOnInit() {
//     //   this.getEventForm();
//     //   this.fnGetsingleOrder();
//     // }

//     // async updateOrder(){

//     //   this.is_submit = true;
//     //   var is_error = false;
  
//     //   if(this.editTicket.invalid){
//     //     this.editTicket.get('name').markAsTouched();
//     //     this.editTicket.get('email').markAsTouched();
//     //     this.editTicket.get('phone').markAsTouched();
//     //     this.editTicket.get('address').markAsTouched();
//     //     this.ErrorService.errorMessage('please fill out required fields.');
//     //     return
//     //   }
  
//     //   var i = 0; 
//     //   await this.eventSpecificForm.forEach(element => {
//     //       if(element.type=='checkbox'){
//     //         var checkBoxArr = [];
//     //         element.selector.forEach(CheckBoxelement => {
//     //           if(CheckBoxelement.is_check){
//     //             checkBoxArr.push(CheckBoxelement.value)
//     //           }
//     //         });
//     //         if(checkBoxArr.length > 0){
//     //           element.value =  JSON.stringify(checkBoxArr); 
//     //         }
//     //       }
//     //       if(element.value==''  && element.required){
//     //         is_error = true;
//     //       }
//     //   });

//     //   if(is_error){
//     //     this.ErrorService.errorMessage('please fill out required fields.');
//     //     return false;
//     //   }
      
//     //   var name = this.editTicket.get("name").value.split(" ");
      
//     //   let requestObject = {
//     //     'event_id' : this.selectedEventCode,
//     //     'boxoffice_id' : this.boxoffice_id,
//     //     'order_id' : this.data.unique_code,
//     //     'firstname' : name[0] ? name[0] : '',
//     //     'lastname' : name[1] ? name[1] : '',
//     //     'phone' : this.editTicket.get("phone").value,
//     //     'email' : this.editTicket.get("email").value,
//     //     'address' : this.editTicket.get("address").value,
//     //     "customer_data" : JSON.stringify({ 'customerForm' : this.eventSpecificForm }),
//     //   }
      
//     //   this.isLoaderAdmin = true;

//     //   this.singleEventServiceService.orderUpdate(requestObject).subscribe((response:any) => {
//     //     if(response.data == true){
//     //       this.ErrorService.successMessage(response.response);
//     //     } else if(response.data == false){
//     //       this.ErrorService.errorMessage(response.response);
//     //     }
//     //   });


//     // }

//     // getEventForm(){

//     //   let requestObject = {
//     //     'event_id' : this.selectedEventCode,
//     //     'option_key' : 'checkout_form',
//     //     'boxoffice_id' : 'NULL'
//     //   }
  
//     //   this.singleEventServiceService.getSingleEventSettings(requestObject).subscribe((response:any) => {
//     //     if(response.data == true){
//     //       var data =   JSON.parse(response.response);
//     //       this.eventForm = data[0].buyer_questions;
//     //       this.change.detectChanges();
//     //     } else if(response.data == false){
//     //       this.ErrorService.errorMessage(response.response);
//     //     }
//     //   });

//     // }

    
//     // fnGetsingleOrder(){

//     //   let requestObject={
//     //     "unique_code":this.data.unique_code,
//     //   }
      
//     //   this.singleEventServiceService.fnGetsingleOrder(requestObject).subscribe((response:any) => {
//     //     if(response.data == true){

//     //       this.singleorderCustomer = response.response;
//     //       this.eventSpecificForm =  JSON.parse(this.singleorderCustomer.customer.customer_data);
//     //       this.eventSpecificForm = this.eventSpecificForm.customerForm;
//     //       console.log(this.eventSpecificForm);

//     //       this.editTicket.controls['name'].setValue(this.singleorderCustomer.customer.name)
//     //       this.editTicket.controls['email'].setValue(this.singleorderCustomer.customer.email)
//     //       this.editTicket.controls['phone'].setValue(this.singleorderCustomer.customer.phone)
//     //       this.editTicket.controls['address'].setValue(this.singleorderCustomer.customer.address)

//     //       this.change.detectChanges();

//     //     }else{
//     //       this.ErrorService.errorMessage(response.response);
//     //     }
//     //   });
//     // }

//     // optionsArr(arr){
//     //   return arr.split(/\r?\n/);
//     // }
  
    
//     // CheckBoxArr(arr){
//     //   var optionToArray = [];
//     //   arr.split(/\r?\n/).forEach(element => {
//     //     optionToArray.push({ 'value': element,'is_check':false});
//     //   });
//     //   return optionToArray;
//     // }
    


// }


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