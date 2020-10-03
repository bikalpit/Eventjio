import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';

@Component({
  selector: 'app-duplicate',
  templateUrl: './duplicate.component.html',
  styleUrls: ['./duplicate.component.scss'],
  providers: [DatePipe]
})
export class DuplicateComponent implements OnInit {

  duplicateArray = [];
  items: FormArray;
  duplicateForm:FormGroup;
  minDate = new Date();
  minTillDate :any = new Date();
  isLoaderAdmin:boolean = false;
  duplicateId:any;
  duplicateEvent:any;
  constructor(
    private formBuilder:FormBuilder,
    private SingleEventServiceService:SingleEventServiceService,
    private ErrorService:ErrorService,
    private datePipe:DatePipe,
  ) 
  { 
    if(localStorage.getItem('selectedEventCode')){
      this.duplicateId = localStorage.getItem('selectedEventCode')
    }

   
  }

  ngOnInit(): void {
    this.duplicateForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()])
    });
  }
  
  fnAddDuplicate(){
    this.items = this.duplicateForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  
  createItem(): FormGroup {
    return this.formBuilder.group({
      event_title:[''],
      start_date:[''],
      end_date:[''],
      event_status:[''],
    });
  }

  fnRemoveDuplicate(index){
    this.duplicateArray.splice(index,1)
  }

  fnChangeValideFrom(){
    // this.minTillDate =this.duplicateForm.get('start_date').value;
    // this.duplicateForm.get('end_date').setValue('');
  }

  saveDuplicate(){
    this.duplicateEvent = {
      "start_date":this.datePipe.transform(new Date(this.duplicateForm.get('start_date').value),"yyyy-MM-dd"),
      "end_date":this.datePipe.transform(new Date(this.duplicateForm.get('end_date').value),"yyyy-MM-dd"),
      "event_title":this.duplicateForm.get("event_title").value,
      "event_status":this.duplicateForm.get("event_status").value,
    };

    if(this.duplicateForm.invalid){
      alert(1);
      this.duplicateForm.get('event_title').markAsTouched();
      this.duplicateForm.get('start_date').markAsTouched();
      this.duplicateForm.get('end_date').markAsTouched();
      this.duplicateForm.get('event_status').markAsTouched();
      return false;
    }   alert(2);
    this.isLoaderAdmin = true;
    let requestObject ={
      "unique_code":this.duplicateId,
      "eventArry":this.duplicateEvent
    }
  this.SingleEventServiceService.duplicateForm(requestObject).subscribe((response:any)=>{
  if(response.data == true){
    this.ErrorService.successMessage(response.response);
    
} else if(response.data == false){
  this.ErrorService.errorMessage(response.response);
  }
  this.isLoaderAdmin = false;
});
  }
}
