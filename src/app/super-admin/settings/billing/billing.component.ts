import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardDetailDialogComponent } from '../../../_components/card-detail-dialog/card-detail-dialog';
import { ErrorService } from '../../../_services/error.service'
import { SettingService } from '../_services/setting.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe} from '@angular/common';
import { orderDetailsComponent } from '../../../_components/single-order-detail/single-order-detail';
import * as moment from 'moment'; 

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  providers: [DatePipe]
})
export class BillingComponent implements OnInit {
  isLoaderAdmin:boolean=false;
  subscriptionStatus:boolean=false;
  creditDetails:any;
  overviewUsageData:any = {
    'already_paid': "",
    'total': "",
    'unpaid': "",
  };
  constructor(
    public dialog: MatDialog,
    private SettingService : SettingService,
    private datePipe: DatePipe,
    private errorService : ErrorService,
  ) { 
    
  }

  ngOnInit(): void {
    this.checkSubscription();
    this.getCreditDetails();
    this.getOverviewUnBillUsage();
  }

  checkSubscription(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_code':localStorage.getItem('boxoffice_id'),    }
    this.SettingService.checkSubscription(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.subscriptionStatus = response.response;
      }
      else if(response.data == false){
        this.errorService.errorMessage(response.response)
      }
      this.isLoaderAdmin = false;
    })
  }

  getCreditDetails(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code':localStorage.getItem('boxoffice_id'),    
    }
    this.SettingService.getCreditDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.creditDetails = response.response;
      }
      else if(response.data == false){
        this.errorService.errorMessage(response.response)
      }
      this.isLoaderAdmin = false;
    })
  }
  
  getOverviewUnBillUsage(){
    this.isLoaderAdmin = true;
    let requestObject= {
      'boxoffice_id':localStorage.getItem('boxoffice_id'), 
    }
    this.SettingService.getOverviewUnBillUsage(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.overviewUsageData = response.response;
        this.overviewUsageData.already_paid = Math.round((this.overviewUsageData.already_paid + Number.EPSILON) * 100) / 100;
        this.overviewUsageData.unpaid = Math.round((this.overviewUsageData.unpaid + Number.EPSILON) * 100) / 100;
        this.overviewUsageData.total = Math.round((this.overviewUsageData.total + Number.EPSILON) * 100) / 100;
      }
      else if(response.data == false){
      this.errorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    })
  }


  onBuyTicketsCredits() {
    const dialogRef = this.dialog.open(DialogUnBuyTicketsCredits, {
      width: '700px',
      data : {subscriptionStatus: this.subscriptionStatus}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {
        this.checkSubscription();
        this.getCreditDetails();
        this.getOverviewUnBillUsage();
      }
    });
  }

  onLearnMore() {
    const dialogRef = this.dialog.open(DialogLearnMore, {
      width: '700px',

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {

      }
    });
  }

  onViewAllInvoices() {
    const dialogRef = this.dialog.open(DialogViewAllInvoices, {
      width: '700px',

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {

      }
    });
  }

  onViewAllUsage() {
    const dialogRef = this.dialog.open(DialogViewAllUsage, {
      width: '1020px',

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {

      }
    });
  }
  onupdateCardDetail() {
    const dialogRef = this.dialog.open(CardDetailDialogComponent, {
      width: '700px',
      // data: "Are you sure you want to delete?"
    });
     dialogRef.afterClosed().subscribe(result => {
      if(result == 'success'){
        this.checkSubscription();
        this.getCreditDetails();
      }
    });
  }
}


@Component({
  selector: 'Buy Tickets Credit',
  templateUrl: '../_dialogs/buy-tickets-credits.html',
  providers: [DatePipe]
})
export class DialogUnBuyTicketsCredits {

  isLoaderAdmin: boolean = false;
  creditList:any=[];
  subscriptionStatus:boolean=false;
  selectedCredit:any = {
    'created_at': "2021-08-16T09:58:10.000000Z",
    'credit_amount': 0.52,
    'credit_qty': 100,
    'credit_type': "100 credits at $0.52 / ticket sale",
    'deleted_at': null,
    'id': 1,
    'unique_code': "credit16291078905390",
  };
  selectedCreditIndex:any = 0;
  discountPr:any = 20;
  buyCreditAction:any='one_time';
  constructor(
    public dialogRef: MatDialogRef<DialogUnBuyTicketsCredits>,
    private SettingService : SettingService,
    private datePipe: DatePipe,
    private errorService : ErrorService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.subscriptionStatus = this.data.subscriptionStatus;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.getCreditList();

  }
  
  getCreditList(){
    this.isLoaderAdmin = true;
    this.SettingService.getCreditList().subscribe((response:any) => {
      if(response.data == true){
        this.creditList = response.response;
      }
      else if(response.data == false){
      this.errorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    })
  }

  
  purchaseCredits(){
    if(this.selectedCredit){
      let requestObject = {
        'boxoffice_code' : localStorage.getItem('boxoffice_id'),
        'credit_code': this.selectedCredit.unique_code,
        'credit_action':this.buyCreditAction,
        'credit_qty': this.selectedCredit.credit_qty,
        'credit_amt': this.selectedCredit.credit_amount,
      }
      this.isLoaderAdmin = true;
      this.SettingService.purchaseCredits(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.dialogRef.close('success');
        }
        else if(response.data == false){
        this.errorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      })
    }else{
      return false;
    }
    
  }


  onChangeCreditQTY(event){
    this.selectedCredit = this.creditList[event.value];
    let tempDes = 100 - ((this.selectedCredit.credit_amount * 100) / 0.65);
    this.discountPr = Math.round((tempDes + Number.EPSILON) * 10) / 10
  }

  buyTicketCredit(){
    if(!this.subscriptionStatus){
      const dialogRef = this.dialog.open(CardDetailDialogComponent, {
        width: '700px',
        // data: "Are you sure you want to delete?"
      });
       dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.purchaseCredits();
        }
      });
    }else{
      this.purchaseCredits();
    }
  }

}

@Component({
  selector: 'Learn More',
  templateUrl: '../_dialogs/learn-more.html'
})
export class DialogLearnMore {

  isLoaderAdmin: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogLearnMore>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {

  }

}


@Component({
  selector: 'All Invoices',
  templateUrl: '../_dialogs/all-invoices.html'
})
export class DialogViewAllInvoices {

  isLoaderAdmin: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogViewAllInvoices>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {

  }

}


@Component({
  selector: 'All Usage',
  templateUrl: '../_dialogs/all-usage.html',
  providers: [DatePipe]
})
export class DialogViewAllUsage {

  isLoaderAdmin: boolean = false;
  usageList:any=[];
  eventsList:any =[];
  eventOccurrenceList:any =[];
  selectedEvent:any;
  selectedStartDate:any;
  selectedEndDate:any;
  constructor(
    public dialogRef: MatDialogRef<DialogViewAllUsage>,
    private SettingService : SettingService,
    private router: Router,
    private datePipe: DatePipe,
    private errorService : ErrorService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.getUnbilledUsage();
      this.getAllEvent();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {

  }

  
  getUnbilledUsage(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id':localStorage.getItem('boxoffice_id'),    
      'event_id':this.selectedEvent,    
      'start_date':this.selectedStartDate?this.datePipe.transform(new Date(this.selectedStartDate),'yy-M-d'):null,
      'end_date':this.selectedEndDate?this.datePipe.transform(new Date(this.selectedEndDate),'yy-M-d'):null,    
    }
    this.SettingService.getUnbilledUsage(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.usageList = response.response;
      }
      else if(response.data == false){
        this.errorService.errorMessage(response.response)
      }
      this.isLoaderAdmin = false;
    })
  }

  
  getAllEvent(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'events_id' : 'all',
      'boxoffice_id' : localStorage.getItem('boxoffice_id')
    }
    this.SettingService.fnGetAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
      // this.eventsList = response.response
      response.response.forEach(element => {
        element.start_date =  this.datePipe.transform(new Date(element.start_date),"EEE MMM d, y");
        if(element.event_occurrence_type == 'Y'){
          element.occurrence.forEach(element1 => {
            if(element1.occurance_start_time){
              element1.occurance_start_time_modified = this.transformTime24To12(element1.occurance_start_time);
            }
            if(element1.occurance_end_time){
              element1.occurance_end_time_modified = this.transformTime24To12(element1.occurance_end_time);
            }
            element1.event_title = element.event_title
            element1.previewLabel = "";
            if(element1.occurance_start_date!=element1.occurance_end_date){
              element1.previewLabel = `${this.datePipe.transform(new Date(element1.occurance_start_date),'MMM d, y')} ${element1.occurance_start_time_modified} To ${this.datePipe.transform(new Date(element1.occurance_end_date),'MMM d, y')} ${element1.occurance_end_time_modified} : ${element.event_title} `;
              
            }else if(element1.occurance_start_date==element1.occurance_end_date){
              element1.previewLabel = `${this.datePipe.transform(new Date(element1.occurance_start_date),'MMM d, y')} ${element1.occurance_start_time_modified} ${element.occurance_start_time_modified?'-':''} ${element1.occurance_end_time_modified} : ${element.event_title} `;
            }
            this.eventOccurrenceList.push(element1)
          });
        }else{
          this.eventsList.push(element)
        }
    
      });
      console.log(this.eventsList)
      console.log(this.eventOccurrenceList)
      }
      else if(response.data == false){
        // this.errorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    })
  }

  
  transformTime24To12(time: any): any {
    if(time != null){
      let hour = (time.split(':'))[0];
      let min = (time.split(':'))[1];
      let part = 'AM';
      let finalhrs = hour
      if(hour == 0){
        finalhrs = 12
      }
      if(hour == 12){
        finalhrs = 12;
        part = 'PM';
      }
      if(hour > 12){
        finalhrs  = hour - 12
        part = 'PM' 
      }
      return `${finalhrs}:${min} ${part}`
    }else{
      return "";
    }
  }

  goToEvent(eventId){
    localStorage.setItem('selectedEventCode', eventId);
    this.router.navigate(["/super-admin/single-event-dashboard/"]);
    this.dialogRef.close();
  }

  clearStartDate(){
    this.selectedStartDate = null;
    this.getUnbilledUsage();
  }
  clearEndDate(){
    this.selectedEndDate = null;
    this.getUnbilledUsage();
  }

  viewOrder(OrderId){
    const dialogRef = this.dialog.open(orderDetailsComponent, {
      width: '700px',
      data : {orderId: OrderId}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
      // if(this.selectedOccurrence && this.selectedOccurrence != 'all'){
      //   this.fnChangeOccurrence();
      // }else{
      //   this.fngetallOrders();
      // }
    });
  }

}
