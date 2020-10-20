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
    this.SettingService.getSettingsValue(requestObject).subscribe((response:any) => {
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
  
  fnDeleteBuyerQuestion(selectedQuestion){
    alert('delete')
    const index: number = this.allQuestionlist[0].buyer_questions.indexOf(selectedQuestion);
    this.allQuestionlist[0].buyer_questions.splice(index, 1);
    console.log(this.allQuestionlist)
  }

  fnEditBuyerQuestion(question, index){
    console.log(question)
    const dialogRef = this.dialog.open(addBuyerQuestionDialog,{
      width: '700px',
      data:{
        boxofficeId: this.boxofficeId,
        allQuestionlist: this.allQuestionlist,
        singleQuestion : question
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.allQuestionlist = result
      }else{
        this.getAllQuestions();
      }
    });
  }

  fnDeleteAttendeeQuestion(selectedQuestion){
    alert('delete')
    const index: number = this.allQuestionlist[0].attendee_questions.indexOf(selectedQuestion);
    this.allQuestionlist[0].attendee_questions.splice(index, 1);
    console.log(this.allQuestionlist)
  }

  fnEditAttendeeQuestion(question, index){
    console.log(question)
    const dialogRef = this.dialog.open(addAttendeeQuestionDialog,{
      width: '700px',
      data:{
        boxofficeId: this.boxofficeId,
        allQuestionlist: this.allQuestionlist,
        singleQuestion : question
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.allQuestionlist = result
      }else{
        this.getAllQuestions();
      }
    });
  }

  fnAddBuyerQuestion(){
    const dialogRef = this.dialog.open(addBuyerQuestionDialog,{
      width: '700px',
      data:{
        boxofficeId: this.boxofficeId,
        allQuestionlist: this.allQuestionlist
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.allQuestionlist = result
      }else{
        this.getAllQuestions();
      }
    });
  }

  fnAddAttendeeQuestion(){
    const dialogRef = this.dialog.open(addAttendeeQuestionDialog,{
      width: '700px',
      data:{
        boxofficeId: this.boxofficeId,
        allQuestionlist: this.allQuestionlist
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.allQuestionlist = result
      }else{
        this.getAllQuestions();
      }
    });
  }

  fnSaveCheckoutForm(){
    this.isLoaderAdmin = true;
    let requestObject ={
      'boxoffice_id' : this.boxofficeId,
      'event_id' :'',
      'option_key':'checkout_form',
      'option_value':this.allQuestionlist,
      'json_type' : 'Y',
    }   
    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.getAllQuestions();
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
  }

  fnCancelSave(){
    this.getAllQuestions();
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
  questionRequired:boolean = false;
  boxofficeId:any;
  optionField:boolean = false;
  termsField:boolean = false;
  defaultQuestion:boolean = false;
  allQuestionlist:any = [];
  singleQuestion:any;
  constructor(
    public dialogRef: MatDialogRef<addBuyerQuestionDialog>,
    private http: HttpClient,
    private SettingService : SettingService,
    private ErrorService : ErrorService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxofficeId = this.data.boxofficeId
      this.allQuestionlist = this.data.allQuestionlist
      this.singleQuestion = this.data.singleQuestion
      console.log(this.singleQuestion)
      console.log(this.allQuestionlist)
      this.newBuyerQForm = this._formBuilder.group({
        type: ['',[Validators.required]],
        label: ['',[Validators.required]],
        options: [''],
        terms: [''],
      });
      
      if(this.singleQuestion){
        this.defaultQuestion = this.singleQuestion.default
        this.newBuyerQForm.controls['label'].setValue(this.singleQuestion.label);
        this.newBuyerQForm.controls['type'].setValue(this.singleQuestion.type);
        this.newBuyerQForm.controls['options'].setValue(this.singleQuestion.options);
        this.newBuyerQForm.controls['terms'].setValue(this.singleQuestion.terms);
        this.questionRequired = this.singleQuestion.required
        if(this.singleQuestion.type == 'text' || this.singleQuestion.type == 'marketing'){
          this.optionField = false;
          this.termsField = false;
        }else if(this.singleQuestion.type == 'terms'){
          this.optionField = false;
          this.termsField = true;
        }else{
          this.optionField = true;
          this.termsField = false;
        }
      }
     
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  fnChangeQType(event){
    console.log(event)
    if(event.value == 'text' || event.value == 'marketing'){
      this.optionField = false;
      this.termsField = false;
    }else if(event.value == 'terms'){
      this.optionField = false;
      this.termsField = true;
    }else{
      this.optionField = true;
      this.termsField = false;
    }
  }

  fnChangeRequired(event){
    this.questionRequired = event.checked
  }

  createNewBuyerQuestion(){
    console.log(this.newBuyerQForm)
    if(this.newBuyerQForm.invalid){
      this.newBuyerQForm.get('label').markAsTouched();
      this.newBuyerQForm.get('type').markAsTouched();
      return false;
    }
    if(this.singleQuestion){
      let newQuestion = {
        'label' : this.newBuyerQForm.get('label').value,
        'required' : this.questionRequired,
        'type' : this.newBuyerQForm.get('type').value,
        'options' : this.newBuyerQForm.get('options').value,
        'terms' : this.newBuyerQForm.get('terms').value,
        'index' : this.singleQuestion.index,
      }
      const index: number = this.allQuestionlist[0].buyer_questions.indexOf(this.singleQuestion);
      this.allQuestionlist[0].buyer_questions.splice(index, 1);
      this.allQuestionlist[0].buyer_questions.push(newQuestion);
    }else{
      let newQuestion = {
        'label' : this.newBuyerQForm.get('label').value,
        'required' : this.questionRequired,
        'type' : this.newBuyerQForm.get('type').value,
        'options' : this.newBuyerQForm.get('options').value,
        'terms' : this.newBuyerQForm.get('terms').value,
        'index' : this.allQuestionlist[0].buyer_questions.length+1,
      }
      this.allQuestionlist[0].buyer_questions.push(newQuestion);
    }
   
    console.log(this.allQuestionlist)
    this.dialogRef.close(this.allQuestionlist);
  }
  
 
}


@Component({
  selector: 'add-attendee-question',
  templateUrl: '../_dialogs/add-attendee-question.html',
})
export class addAttendeeQuestionDialog {
  status = true;
  newAttendeeQForm: FormGroup
  isLoaderAdmin:boolean = false;
  questionRequired:boolean = false;
  boxofficeId:any;
  optionField:boolean = false;
  termsField:boolean = false;
  defaultQuestion:boolean = false;
  allQuestionlist:any = [];
  singleQuestion:any;
  constructor(
    public dialogRef: MatDialogRef<addAttendeeQuestionDialog>,
    private http: HttpClient,
    private SettingService : SettingService,
    private ErrorService : ErrorService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxofficeId = this.data.boxofficeId
      this.allQuestionlist = this.data.allQuestionlist
      this.singleQuestion = this.data.singleQuestion
      console.log(this.singleQuestion)
      console.log(this.allQuestionlist)
      this.newAttendeeQForm = this._formBuilder.group({
        type: ['',[Validators.required]],
        label: ['',[Validators.required]],
        options: [''],
        terms: [''],
      });

      
      if(this.singleQuestion){
        this.defaultQuestion = this.singleQuestion.default
        this.newAttendeeQForm.controls['label'].setValue(this.singleQuestion.label);
        this.newAttendeeQForm.controls['type'].setValue(this.singleQuestion.type);
        this.newAttendeeQForm.controls['options'].setValue(this.singleQuestion.options);
        this.newAttendeeQForm.controls['terms'].setValue(this.singleQuestion.terms);
        this.questionRequired = this.singleQuestion.required
        if(this.singleQuestion.type == 'text' || this.singleQuestion.type == 'marketing'){
          this.optionField = false;
          this.termsField = false;
        }else if(this.singleQuestion.type == 'terms'){
          this.optionField = false;
          this.termsField = true;
        }else{
          this.optionField = true;
          this.termsField = false;
        }
      }

    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  fnChangeQType(event){
    console.log(event)
    if(event.value == 'text' || event.value == 'marketing'){
      this.optionField = false;
      this.termsField = false;
    }else if(event.value == 'terms'){
      this.optionField = false;
      this.termsField = true;
    }else{
      this.optionField = true;
      this.termsField = false;
    }
  }
  
  fnChangeRequired(event){
    this.questionRequired = event.checked
  }

  createNewAttendeeQuestion(){
    console.log(this.newAttendeeQForm)
    if(this.newAttendeeQForm.invalid){
      this.newAttendeeQForm.get('label').markAsTouched();
      this.newAttendeeQForm.get('type').markAsTouched();
      return false;
    }
    let newQuestion = {
      'label' : this.newAttendeeQForm.get('label').value,
      'required' : this.questionRequired,
      'type' : this.newAttendeeQForm.get('type').value,
      'options' : this.newAttendeeQForm.get('options').value,
      'terms' : this.newAttendeeQForm.get('terms').value,
      'index' : this.allQuestionlist[0].attendee_questions.length+1,
    }
    this.allQuestionlist[0].attendee_questions.push(newQuestion);
    console.log(this.allQuestionlist)
    this.dialogRef.close(this.allQuestionlist);
  }
  
 
}

