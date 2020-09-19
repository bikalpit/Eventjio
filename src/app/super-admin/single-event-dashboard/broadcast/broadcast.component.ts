import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {
  animal :any;
  allBusiness: any;

  constructor(public dialog: MatDialog,
    private http: HttpClient,) { 
    
  }

  ngOnInit(): void {
  }
  sendBroadcast() {
    const dialogRef = this.dialog.open(mySendBroadcastDialog, {
      width: '550px',
    });
 
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
}
@Component({
  selector: 'Send-Broadcast',
  templateUrl: '../_dialogs/send-broadcast.html',
})
export class mySendBroadcastDialog { 
  
  constructor(
    public dialogRef: MatDialogRef<mySendBroadcastDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  
}
