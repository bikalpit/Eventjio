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

@Component({
  selector: 'app-occurrences',
  templateUrl: './occurrences.component.html',
  styleUrls: ['./occurrences.component.scss'],
  providers: [DatePipe]
})
export class OccurrencesComponent implements OnInit {

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
    
   }

  ngOnInit(): void {
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
  checkAllDayValue:any = 'show';

  constructor(
    public dialogRef: MatDialogRef<addRepeatOccurrence>,
    private _formBuilder: FormBuilder,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private SingleEventServiceService: SingleEventServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.startEndTime.length = 1;
      this.finalRepeatData.length = 1;

      this.dayTimeForm = this._formBuilder.group({
        dayTimeArr: this._formBuilder.array([this.createTimeSlote()])
      });

      this.repeatForm = this._formBuilder.group({
        repeatDataArr:this._formBuilder.array([this.createRepeatSlote()])
      });

    }

    ngOnInit(): void {
      this.getTimeSlote();
    }

    createTimeSlote(){
      return this._formBuilder.group({
        stratTime:['',[Validators.required]],
        endTime:['',[Validators.required]]
      })
    }

    createRepeatSlote(){
      return this._formBuilder.group({
        stratDate:['',[Validators.required]],
        repeat:['',[Validators.required]],
        endDate:['',[Validators.required]]
      })
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
        this.checkAllDayValue = "show"
      }
      if(e.checked == false){
        this.checkAllDayValue = "hide"
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

  fnChangeStartTime(event){
    console.log(event)
    this.dayStartTime = this.fullDayTimeSlote[event];
    console.log(this.dayStartTime)
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
        occurrence_start_date: ['',[Validators.required]],
        occurrenceStartTime: ['',[Validators.required]],
        occurrence_end_date: ['',[Validators.required]],
        occurrenceEndTime: ['',[Validators.required]],
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

  fnChangeEventEndDate(){
    this.minEndDate = this.singleOccurrenceForm.get('occurrence_start_date').value

    var todayDate = this.datePipe.transform(new Date(),"yyyy-MM-dd")
    var selectedStartDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurrence_start_date').value),"yyyy-MM-dd")
    if(selectedStartDate === todayDate){
      this.singleOccurrenceForm.get('occurrence_start_date').setValue('');
      this.startdateToday=true;
      this.currentTime = this.datePipe.transform(new Date(),"h:mm a")
      this.currentTime = this.transformTime(this.datePipe.transform(new Date(),"h:mm a"))
    }else{
      this.startdateToday=false;
    }
    this.singleOccurrenceForm.get('occurrence_end_date').setValue('');
    this.singleOccurrenceForm.get('occurrenceEndTime').setValue('');
  }
  

  fnChangeStartTime(event){
    this.singleOccurrenceForm.get('occurrenceEndTime').setValue('');
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}
