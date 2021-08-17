import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './card-detail-dialog.html',
  styleUrls: ['./card-detail-dialog.scss']
})
export class CardDetailDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CardDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit() { 
  	
  }
  
onNoClick(): void {
    this.dialogRef.close();
  }
}
