import { Component, OnInit ,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent implements OnInit {
  animal :any;
  allBusiness: any;
  

  reportType:any = 'global';
  buyerQuestion = [{persondetail:'Name'},{persondetail:'Email'},{persondetail:'Mobile Phone Number'},{persondetail:'Address'}]

  

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.buyerQuestion, event.previousIndex, event.currentIndex);
  }

  
  constructor(
    public dialog: MatDialog,
     private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }
  fnCheckoutForm(event){
    this.reportType=event.value
  }

  
  
 

  addBuyerQuestion() {
    const dialogRef = this.dialog.open(addBuyeronlyQuestionDialog, {
      width: '550px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
  addAttendeeQuestion(){
    const dialogRef = this.dialog.open(addAttendeeonlyQuestionDialog, {
      width: '550px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
  editBuyerName() {
    const dialogRef = this.dialog.open(editBuyerNameDialog, {
      width: '550px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
  editAttendeeName(){
    const dialogRef = this.dialog.open(editAttendeeNameDialog, {
      width: '550px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
  
}
@Component({
  selector: 'add-buyer-question',
  templateUrl: '../_dialogs/add-buyer-question.html',
})
export class addBuyeronlyQuestionDialog { 
  buyerResponse: any;

  constructor(
    public dialogRef: MatDialogRef<addBuyeronlyQuestionDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  fnBuyerResponse(event){
    this.buyerResponse=event.value;
  }
  
}
@Component({
  selector: 'add-buyer-question',
  templateUrl: '../_dialogs/edit-buyer-name.html',
})
export class editBuyerNameDialog { 
  
  constructor(
    public dialogRef: MatDialogRef<editBuyerNameDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  
}
@Component({
  selector: 'add-buyer-question',
  templateUrl: '../_dialogs/add-attendee-question.html',
})
export class addAttendeeonlyQuestionDialog { 
  optionValue:any;
  constructor(
    public dialogRef: MatDialogRef<addAttendeeonlyQuestionDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  fnAttendeeResponse(event){
    this.optionValue=event;
  }
}
@Component({
  selector: 'add-buyer-question',
  templateUrl: '../_dialogs/edit-attendee-name.html',
})
export class editAttendeeNameDialog { 
  
  constructor(
    public dialogRef: MatDialogRef<editAttendeeNameDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  
}
