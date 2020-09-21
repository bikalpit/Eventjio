import { Component, OnInit, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-sales-tax',
  templateUrl: './sales-tax.component.html',
  styleUrls: ['./sales-tax.component.scss']
})
export class SalesTaxComponent implements OnInit {

  tax = true;
  gst = true;
  cgst = true;
  

  constructor(public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  fnAddSalesTaxDialog() {
    const dialogRef = this.dialog.open(AddSalesTax,{
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'add-sales-tax',
  templateUrl: '../../_dialogs/add-sales-tax.component.html',
})
export class AddSalesTax {
  status = true;
  constructor(
    public dialogRef: MatDialogRef<AddSalesTax>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}
