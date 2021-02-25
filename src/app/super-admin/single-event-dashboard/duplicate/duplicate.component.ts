import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe } from '@angular/common';
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
  duplicateForm: FormGroup;
  minDate = new Date();
  minTillDate: any = new Date();
  isLoaderAdmin: boolean = false;
  isPastEvent: boolean = false;
  duplicateId: any;
  eventName: any;
  fullDayTimeSlote:any;
  starTime:any;
  endTime:any;
  errorMessage:any;
  startEndSameDate:any;
  // duplicateForm:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private SingleEventServiceService: SingleEventServiceService,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.duplicateArray.length = 1;
    if (localStorage.getItem('selectedEventCode')) {
      this.duplicateId = localStorage.getItem('selectedEventCode')
    }

    // this.duplicateForm = this.formBuilder.group({
    //   event_title: ['', Validators.required],
    //   start_date: ['', Validators.required],
    //   end_date: ['', Validators.required],
    //   event_status: ['', Validators.required],
    // });

    this.duplicateForm = this.formBuilder.group({
      items: this.formBuilder.array([ this.createItem() ])
    });

  }

  ngOnInit(): void {
    this.fnGetEventDetail();
    this.getTimeSlote()
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      event_title: ['',Validators.required],
      start_date:  ['',Validators.required],
      start_time:  ['',Validators.required],
      end_date:  ['',Validators.required],
      end_time:  ['',Validators.required],
      event_status:  ['',Validators.required]
    });
  }


  fnAddDuplicate() {
    this.items = this.duplicateForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  fnRemoveDuplicate(index) {
    var x = confirm('Are you sure you want to delete?')
    if(x){
      (this.duplicateForm.get('items') as FormArray).removeAt(index);
    }
  }
  fnChangeEventStartDate(event){
    this.minTillDate = event.value;
    this.errorMessage = null;
    // this.minTillDate = this.duplicateForm.get('start_date').value;
  }
  fnChangeEventEndDate(event){
    alert()
    console.log(event)
    let startDate = this.datePipe.transform(new Date(this.minTillDate),"yyyy-MM-dd");
    let endDate = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd");
   
    if(startDate == endDate){
      this.startEndSameDate = true;
    }else{
      this.startEndSameDate = false;
    }
    this.errorMessage = null;
  }
  onStatusChange(){
    this.errorMessage = null;
  }

  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      // alert(response.data)
      if(response.data == true){
        this.fullDayTimeSlote= response.response
      }
    });
  }

  onChangeStartTime(e,i){
    console.log('start')
    this.starTime = this.fullDayTimeSlote[e.source.value]
    console.log(this.starTime)
    this.errorMessage = null;
  }

  onChangeEndTime(e){
    console.log('end')
    this.endTime =this.fullDayTimeSlote[e.source.value]
    console.log(this.endTime)
    this.errorMessage = null;
  }

  getContactsFormGroup(index): FormGroup {
    return this.duplicateForm.controls[index] as FormGroup;
  }

  onchenageformValue(){
    this.errorMessage = null;
  }

  fnGetEventDetail() {

    let requestObject = {
      'unique_code': this.duplicateId,
    }

    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.eventName = response.response.event[0];
        this.isPastEvent = response.response.past
        this.eventName.start_date = this.datePipe.transform(this.eventName.start_date, "EEE MMM d, y")
        this.eventName.end_date = this.datePipe.transform(this.eventName.end_date, "EEE MMM d, y")
      } else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
      }
    });

  }
 

  async saveDuplicate() {

    if (this.duplicateForm.invalid) {
      // this.duplicateForm.get('event_title').markAsTouched();
      // this.duplicateForm.get('start_date').markAsTouched();
      // this.duplicateForm.get('end_date').markAsTouched();
      // this.duplicateForm.get('event_status').markAsTouched();
      // this.ErrorService.errorMessage('please fill up the required fields');
      this.errorMessage = "Please fill up the required fields"
      return false;
    }
    

    var is_wrong_date_select = false;
    this.duplicateForm.value.items.forEach((element,aa,key) => {
      var start_date = this.datePipe.transform(new Date(element.start_date), "yyyy-MM-dd");
      var end_date = this.datePipe.transform(new Date(element.end_date), "yyyy-MM-dd");

      var g1 = new Date(start_date); 
      var g2 = new Date(end_date);
     
      if (g1.getTime() >  g2.getTime()) {
        is_wrong_date_select = true;
      }
    });

    if(is_wrong_date_select){
      this.ErrorService.errorMessage('please select valid date of events');
      return;
    }
    
   
    var i = 0;
    await this.duplicateForm.value.items.forEach(element => {
      
        let requestObject = {
          "start_date" : this.datePipe.transform(new Date(element.start_date), "yyyy-MM-dd"),
          "end_date" : this.datePipe.transform(new Date(element.end_date), "yyyy-MM-dd"),
          "start_time" : this.starTime,
          "end_time" : this.endTime,
          "event_title" : element.event_title,
          "event_status" : element.event_status,
          "unique_code": this.duplicateId,
        };
        this.isLoaderAdmin = true;
        i++;
  
         this.SingleEventServiceService.duplicateForm(requestObject).subscribe((response: any) => {
          if (response.data == true) {
            this.ErrorService.successMessage(response.response);
            if(this.duplicateForm.value.items.length == i){
              this.router.navigate(["/super-admin/events"]);
            }
          } else if (response.data == false) {
            this.ErrorService.errorMessage(response.response);
          }
          this.isLoaderAdmin = false;
        });
     
      
    });
  
  }
}