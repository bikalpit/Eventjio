import { Component, OnInit ,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  animal :any;
  allBusiness: any;

   constructor(
    public dialog: MatDialog,
     private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  creatDiscountCode() {
    const dialogRef = this.dialog.open(myCreateDiscountCodeDialog, {
      width: '1100px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

}

@Component({
  selector: 'Create-Discount-Code',
  templateUrl: '../_dialogs/create-discount-code-dialog.html',
})
export class myCreateDiscountCodeDialog { 
  
  constructor(
    public dialogRef: MatDialogRef<myCreateDiscountCodeDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  
}
