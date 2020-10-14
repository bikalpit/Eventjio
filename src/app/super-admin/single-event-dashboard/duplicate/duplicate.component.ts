import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(
    private formBuilder:FormBuilder,
    private SingleEventServiceService:SingleEventServiceService,
    private ErrorService:ErrorService,
    private datePipe:DatePipe,
    private router: Router,
  ) 
  { 
    this.duplicateArray.length = 1;
    if(localStorage.getItem('selectedEventCode')){
      this.duplicateId = localStorage.getItem('selectedEventCode')
    }
  
    this.duplicateForm = this.formBuilder.group({
      event_title:['',Validators.required],
      start_date:['',Validators.required],
      end_date:['',Validators.required],
      event_status:['',Validators.required],
   });
          
  }

  ngOnInit(): void {
    
  }
  
  fnAddDuplicate(){
    this.duplicateArray.push(this.duplicateArray.length+1);
  }
  
  fnRemoveDuplicate(index){
    this.duplicateArray.splice(index,1)
  }

  fnChangeValideFrom(){
    this.minTillDate =this.duplicateForm.get('start_date').value;
    this.duplicateForm.get('end_date').setValue('');
  }

  saveDuplicate(){
    if(this.duplicateForm.invalid){
      this.duplicateForm.get('event_title').markAsTouched();
      this.duplicateForm.get('start_date').markAsTouched();
      this.duplicateForm.get('end_date').markAsTouched();
      this.duplicateForm.get('event_status').markAsTouched();
      return false;
    }
    this.isLoaderAdmin = true;
    let requestObject ={
      "unique_code":this.duplicateId,
      "start_date":this.datePipe.transform(new Date(this.duplicateForm.get('start_date').value),"yyyy-MM-dd"),
      "end_date":this.datePipe.transform(new Date(this.duplicateForm.get('end_date').value),"yyyy-MM-dd"),
      "event_title":this.duplicateForm.get("event_title").value,
      "event_status":this.duplicateForm.get("event_status").value,
    }
  this.SingleEventServiceService.duplicateForm(requestObject).subscribe((response:any)=>{
  if(response.data == true){
    this.ErrorService.successMessage(response.response);
    this.router.navigate(["/super-admin/events"]);
    
} else if(response.data == false){
  this.ErrorService.errorMessage(response.response);
  }
  this.isLoaderAdmin = false;
});
  }
}