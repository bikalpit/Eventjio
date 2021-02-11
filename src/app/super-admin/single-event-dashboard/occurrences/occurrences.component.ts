import {Component, OnInit, ViewChild,Inject,ChangeDetectorRef, ElementRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Observable, throwError, ReplaySubject, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment'
import { Router, ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { invalid } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-occurrences',
  templateUrl: './occurrences.component.html',
  styleUrls: ['./occurrences.component.scss'],
  providers: [DatePipe]
})
export class OccurrencesComponent implements OnInit {
  isLoaderAdmin:boolean=false;
  event_id:any;
  boxoffice_id:any;
  allOccurrenceList:any;
  selectedOccurrenceAarry:any=[];
  selectAll: boolean = false;
  // selectedfilter:any;
  constructor(
    
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private router: Router,
    private el: ElementRef,
    private SingleEventServiceService: SingleEventServiceService,
    private change:ChangeDetectorRef
  ) {
    if(localStorage.getItem('selectedEventCode')){
      this.event_id = localStorage.getItem('selectedEventCode')
    }
   }

  ngOnInit(): void {
    this.getAllOccurrenceList();
  }


  getAllOccurrenceList(){
    this.isLoaderAdmin=true;
    let requestObject = {
      'event_id':this.event_id,
      'filter':'all'
    }
    this.SingleEventServiceService.getAllOccurrenceList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allOccurrenceList= response.response;
        this.allOccurrenceList.forEach(element => {
          if(element.soldout.length == 0){
            element.soldout = 'Tickets are not available'
          }
          if(element.final_revenue.length == 0){
            element.final_revenue = 'Tickets are not available'
          }
          if(element.remaining.length == 0){
            element.remaining = 'Tickets are not available'
          }
          // element.occurance_start_time = moment(element.occurance_start_time).format('hh:mm a');
          // element.occurance_end_time = moment(element.occurance_end_time).format('hh:mm a');
        });
        console.log(this.allOccurrenceList)

      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response)
      }
    });
    this.isLoaderAdmin=false;
  }

  checkAll(event){

    this.selectedOccurrenceAarry = [];

    for (let i = 0; i < this.allOccurrenceList.length; i++) {
      const item = this.allOccurrenceList[i];
      item.is_selected = event.checked;
      if(event.checked){
        

        this.selectedOccurrenceAarry.push(item.unique_code)
      }
    }

    if(event.checked){
      this.selectAll = true;
    }else{
      this.selectAll = false;
    }

    console.log(this.selectedOccurrenceAarry);

  }

  fnChangeOccuStatus(value){
    if(value == 'DEL'){
      this.fnOccurrenceDelete();
    }else {
      this.isLoaderAdmin=true;
      let requestObject = {
        'occurance_id':this.selectedOccurrenceAarry,
        'status':value
      }
      this.SingleEventServiceService.occurrenceStatusUpdate(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.ErrorService.successMessage(response.response)
          this.selectedOccurrenceAarry.length = 0;
          this.selectAll = false;
          this.getAllOccurrenceList();
  
        }else if(response.data == false){
          this.ErrorService.errorMessage(response.response)
        }
      });
      this.isLoaderAdmin=false;
    }
  }

  fnOccurrenceDelete(){
    this.isLoaderAdmin=true;
    let requestObject = {
      'occurance_id':this.selectedOccurrenceAarry,
    }
    
    this.SingleEventServiceService.occurrenceDelete(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.selectedOccurrenceAarry.length = 0;
        this.selectAll = false;
        this.getAllOccurrenceList();
        
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin=false;
  }
  
  singleStatusUpdate(occCode,status){
    this.selectedOccurrenceAarry.push(occCode);
    this.fnChangeOccuStatus(status);
  }

  fnAddOccurrenceId(event, OccId,i){

    if(event == true){
      this.selectedOccurrenceAarry.push(OccId);
      this.allOccurrenceList[i].is_selected = true;

    }else if(event == false){
      this.allOccurrenceList[i].is_selected = false;

      const index = this.selectedOccurrenceAarry.indexOf(OccId, 0);
      if (index > -1) {
          this.selectedOccurrenceAarry.splice(index, 1);
      }
    }
    if (this.selectedOccurrenceAarry.length == this.allOccurrenceList.length ) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }

    console.log(this.selectedOccurrenceAarry);
  }


  fnCreateRepeatOccurrence(){
    const dialogRef = this.dialog.open(addRepeatOccurrence,{
      width: '1100px',
      data : {
        // boxOfficeCode : this.boxOfficeCode,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllOccurrenceList();
      }
    });
  }

  fnCreateSingleOccurrence(){
    const dialogRef = this.dialog.open(addSingleOccurrence,{
      width: '1100px',
      data : {
        // boxOfficeCode : this.boxOfficeCode,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllOccurrenceList();
      }
    });
  }
}

@Component({
  selector: 'add-repeat-occurrence',
  templateUrl: '../_dialogs/add-repeat-occurrence.html',
  providers: [DatePipe]
})
export class addRepeatOccurrence {

  addRepeatRecurrenceForm:FormGroup;
  fullDayTimeSlote:any;
  dayStartTime:any;
  dayEndTime:any;
  dayTimeForm:FormGroup;
  dayTimeArr:FormArray;
  startEndTime:any=[];
  minSelectStartDate:any = new Date();
  minSelectEndDate:any = new Date();
  dateSelectfield:boolean = false;

  repeatForm:FormGroup;
  repeatDataArr:FormArray;
  finalRepeatData:any = [];

  selected = 'na';
  allDayCheckOption:any = 'N';
  checkAllDayValue:boolean = true;
  constructor(
    public dialogRef: MatDialogRef<addRepeatOccurrence>,
    private _formBuilder: FormBuilder,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private SingleEventServiceService: SingleEventServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.startEndTime.length = 1;
      this.dayTimeForm = this._formBuilder.group({
        dayTimeArr: this._formBuilder.array([this.createTimeSlote()])
      });

      this.finalRepeatData.length = 1;
      this.repeatForm = this._formBuilder.group({
        repeatDataArr:this._formBuilder.array([this.createRepeatSlote()])
      });

    }

    ngOnInit(): void {
      this.getTimeSlote();
    }

    onSubmit(){
      this.dayTimeArr = this.dayTimeForm.get('dayTimeArr') as FormArray;
      this.startEndTime = this.dayTimeForm.value.dayTimeArr;

      if(this.startEndTime[this.startEndTime.length-1].start_time == '' && this.startEndTime[this.startEndTime.length-1].label == ''){
        this.startEndTime.splice(this.startEndTime.length-1, 1);
      }else if(this.startEndTime[this.startEndTime.length-1].start_time == '' && this.startEndTime[this.startEndTime.length-1].label != ''){
        this.ErrorService.errorMessage('start time is blank.');
        return false;
      }else if(this.startEndTime[this.startEndTime.length-1].start_time != '' && this.startEndTime[this.startEndTime.length-1].label == ''){
        this.ErrorService.errorMessage('end time is blank.');
        return false;
      }
     

      this.repeatDataArr = this.repeatForm.get('repeatDataArr') as FormArray;
      this.finalRepeatData = this.repeatForm.value.repeatDataArr;

     


      let requestObject = {
        "all_day" : this.allDayCheckOption,
        "event_id" : localStorage.getItem('selectedEventCode'),
        "timeslots" : this.startEndTime,
        "dateslots" : this.finalRepeatData  
      }
      this.SingleEventServiceService.repeatOccurrenceCreate(requestObject).subscribe((response:any) =>   {
        if(response.data == true){
          this.ErrorService.errorMessage(response.response); 
          this.dialogRef.close('created')
        }else{
          this.ErrorService.errorMessage(response.response);
        }
      })
    }

    createTimeSlote(){
      return this._formBuilder.group({
        start_time:['',[Validators.required]],
        end_time:['',[Validators.required]]
      })
    }

    createRepeatSlote(){
      return this._formBuilder.group({
        start_date:['',[Validators.required]],
        repeat:['',[Validators.required]],
        end_date:['',[Validators.required]]
      });
    }

    fnAddStartEndTime(){
      this.dayTimeArr = this.dayTimeForm.get('dayTimeArr') as FormArray;
      this.dayTimeArr.push(this.createTimeSlote());
      this.startEndTime = this.dayTimeForm.value.dayTimeArr
      console.log('this.startEndTime-------------------------------------')
      console.log(this.startEndTime)
    }

    fnAddRepeat(){
      this.repeatDataArr = this.repeatForm.get('repeatDataArr') as FormArray; 
      this.repeatDataArr.push(this.createRepeatSlote());
      this.finalRepeatData = this.repeatForm.value.repeatDataArr;
      console.log('this.finalRepeatData-----------------------------------')
      console.log(this.finalRepeatData);
    } 
    
    fnDeleteDayTime(index){
  
    }

    fnChangeWholeDay(e){
      if(e.checked == true){
        this.checkAllDayValue = false
        this.allDayCheckOption = 'Y';
        this.dayTimeForm.reset();
      }
      if(e.checked == false){
        this.checkAllDayValue = true;
        this.allDayCheckOption = 'N'
      }
    }

    onChangeRepeat(event){
      console.log(this.selected)
      if(event.value == this.selected){
        this.dateSelectfield = false
      }else{
        this.dateSelectfield = true
      }

    }
    
  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response;

      }
    });
  }


  
  

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'add-single-occurrence',
  templateUrl: '../_dialogs/add-single-occurrence.html',
  providers: [DatePipe]
})
export class addSingleOccurrence {

  addRepeatRecurrenceForm:FormGroup;
  fullDayTimeSlote:any;
  dayStartTime:any;
  singleOccurrenceForm:FormGroup;
  minStartDate:any=new Date();
  minEndDate:any=new Date();
  startdateToday:boolean=false;
  currentTime:any;
  constructor(
    public dialogRef: MatDialogRef<addSingleOccurrence>,
    private _formBuilder: FormBuilder,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private SingleEventServiceService: SingleEventServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.singleOccurrenceForm =  this._formBuilder.group({
        occurance_start_date: ['',[Validators.required]],
        occurance_end_date: ['',[Validators.required]],
        occurance_start_time: ['',[Validators.required]],
        occurance_end_time: ['',[Validators.required]],
      })
    }

    ngOnInit(): void {
      this.getTimeSlote();
    }

     
    
  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response;

      }
    });
  }

  
  // time formate 12 to 24
  transformTime(time: any): any {
    let hour = (time.split(':'))[0];
    let temp = (time.split(':'))[1];
    let min = (temp.split(' '))[0];
    let part = (time.split(' '))[1];
    if(part == 'PM' && hour !== '12'){
      hour = Number(hour)+12;
    }
    return `${hour}:${min}`
  }
  fnChangeEventStartDate(){

  }

  fnChangeEventEndDate(){
    // alert(this.singleOccurrenceForm.get('occurance_end_date').value)
    this.minEndDate = this.singleOccurrenceForm.get('occurance_start_date').value

    var todayDate = this.datePipe.transform(new Date(),"yyyy-MM-dd")
    var selectedStartDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurance_start_date').value),"yyyy-MM-dd")
    if(selectedStartDate === todayDate){
      this.singleOccurrenceForm.get('occurance_start_date').setValue('');
      this.startdateToday=true;
      this.currentTime = this.datePipe.transform(new Date(),"h:mm a")
      this.currentTime = this.transformTime(this.datePipe.transform(new Date(),"h:mm a"))
    }else{
      this.startdateToday=false;
    }
    // this.singleOccurrenceForm.get('occurrence_end_date').setValue('');
    // this.singleOccurrenceForm.get('occurrenceEndTime').setValue('');
  }
  

  fnChangeStartTime(event){
    this.singleOccurrenceForm.get('occurrenceEndTime').setValue('');
  }

  fnChangeEndTime(event){

  }
  onSubmit(){
    if(this.singleOccurrenceForm.valid){
      var stratDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurance_start_date').value), 'yyyy-MM-dd')
      var endDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurance_end_date').value), 'yyyy-MM-dd')
      let requestObject = {
        
        "event_id":localStorage.getItem('selectedEventCode'),
        "all_day":'N',
        "occurance_start_date": stratDate,
        "occurance_end_date": endDate,
        "occurance_start_time": this.fullDayTimeSlote[this.singleOccurrenceForm.get('occurance_start_time').value],
        "occurance_end_time": this.fullDayTimeSlote[this.singleOccurrenceForm.get('occurance_end_time').value],
      
      }
      this.SingleEventServiceService.singleOccurrenceCreate(requestObject).subscribe((response:any)=>{
        if(response.data == true){
          this.ErrorService.errorMessage(response.response)
          this.dialogRef.close('created');
        }else{
          this.ErrorService.errorMessage(response.response)
        }
      })
    }else{
      this.singleOccurrenceForm.get('occurance_start_date').markAllAsTouched()
      this.singleOccurrenceForm.get('occurance_end_date').markAllAsTouched()
      this.singleOccurrenceForm.get('occurance_start_time').markAllAsTouched()
      this.singleOccurrenceForm.get('occurance_end_time').markAllAsTouched()
    }
    
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}
