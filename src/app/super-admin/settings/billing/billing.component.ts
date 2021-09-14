import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardDetailDialogComponent } from '../../../_components/card-detail-dialog/card-detail-dialog';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
 
  constructor(
    public dialog: MatDialog
  ) { 
    
  }

  ngOnInit(): void {
  }


  onBuyTicketsCredits() {
    const dialogRef = this.dialog.open(DialogUnBuyTicketsCredits, {
      width: '700px',

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {

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
      if(result){
        // this.isLoaderAdmin = true;
        // let requestObject = {
        //   'unique_code': couponcode_code
        // }
        // this.SuperadminService.fnDeleteCoupon(requestObject).subscribe((response:any) => {
        //   if(response.data == true){
        //     this.errorService.successMessage(response.response);
        //     this.getAllCouponCodes();
        //   }
        //   else if(response.data == false){
        //   this.errorService.errorMessage(response.response);
        //   }
        // })
        // this.isLoaderAdmin = false;
      }
    });
  }

  onUpdateVatInfo() {
    const dialogRef = this.dialog.open(DialogUpdateVatInfo, {
      width: '700px',

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {

      }
    });
  }
}


@Component({
  selector: 'Buy Tickets Credit',
  templateUrl: '../_dialogs/buy-tickets-credits.html'
})
export class DialogUnBuyTicketsCredits {

  isLoaderAdmin: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogUnBuyTicketsCredits>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {

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
  templateUrl: '../_dialogs/all-usage.html'
})
export class DialogViewAllUsage {

  isLoaderAdmin: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogViewAllUsage>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {

  }

}


@Component({
  selector: 'Update Vat Info',
  templateUrl: '../_dialogs/update-vat-info.html'
})
export class DialogUpdateVatInfo {

  isLoaderAdmin: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateVatInfo>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {

  }

}