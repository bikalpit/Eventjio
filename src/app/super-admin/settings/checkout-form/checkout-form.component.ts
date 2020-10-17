import { Component, OnInit, Inject } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormControl,FormArray,FormGroup, FormBuilder, Validators, ValidatorFn} from '@angular/forms';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent implements OnInit {
  isLoaderAdmin:boolean = false;
  
  boxofficeId:any;
  buyerQuestionList :any = [];
  attendeeQuestionList :any = [];
  allQuestionlist:any

  constructor(
    private _formBuilder : FormBuilder,
    private SettingService : SettingService,
    private ErrorService : ErrorService,
    public dialog: MatDialog,
    
  ) { 
    if(localStorage.getItem('boxoffice_id')){
      this.boxofficeId = localStorage.getItem('boxoffice_id');  
    }
    this.getAllQuestions();
   
  }
 
  ngOnInit(): void {
    let name = {
      'name': 'Name'
    }
  }

  buyerQuestionDrop(event: CdkDragDrop<string[]>) {
    console.log(event)
    if(event.previousIndex === 0 || event.previousIndex === 1 || event.previousIndex === 2 || event.previousIndex === 3){
      return false
    }else{
      moveItemInArray(this.buyerQuestionList, event.previousIndex, event.currentIndex);
    }

  }
  attendeeQuestionDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.attendeeQuestionList, event.previousIndex, event.currentIndex);
  }

  getAllQuestions(){
    this.isLoaderAdmin = true;
    let requestObject ={
      'boxoffice_id' : this.boxofficeId,
      'event_id' :'NULL',
      'option_key':'checkout_form',
    }   
    this.SettingService.getAllCheckoutQuestions(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allQuestionlist = JSON.parse(response.response)
        console.log(this.allQuestionlist[0])
        this.buyerQuestionList = this.allQuestionlist[0].buyer_questions
        this.attendeeQuestionList = this.allQuestionlist[0].attendee_questions
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
    }

  fnAddBuyerQuestion(){
    const dialogRef = this.dialog.open(addBuyerQuestionDialog,{
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  fnAddAttendeeQuestion(){
    const dialogRef = this.dialog.open(addAttendeeQuestionDialog,{
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}


@Component({
  selector: 'add-buyer-question',
  templateUrl: '../_dialogs/add-buyer-question.html',
})
export class addBuyerQuestionDialog {
  status = true;
  newBuyerQForm: FormGroup
  isLoaderAdmin:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<addBuyerQuestionDialog>,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.newBuyerQForm = this._formBuilder.group({
        type: ['',[Validators.required]],
        label: ['',[Validators.required]],
        options: ['']
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  fnChangeQType(event){
    console.log(event)
  }

  fnChangeRequired(event){
    console.log(event)
  }

  createNewBuyerQuestion(){
    console.log(this.newBuyerQForm)
  }
  
 
}


@Component({
  selector: 'add-attendee-question',
  templateUrl: '../_dialogs/add-attendee-question.html',
})
export class addAttendeeQuestionDialog {
  status = true;
  constructor(
    public dialogRef: MatDialogRef<addAttendeeQuestionDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}

