import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
