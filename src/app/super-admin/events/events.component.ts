import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';

interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  
 addNewEvents : boolean = true;
 addEventForm : FormGroup;

  upcomingEventData = [{event:'Lajawab Cooking Classes',status:'Draft',sold:'00',remaining:'00',revenue:'$.00.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},]
 
                pastEventData = [{event:'Lajawab Cooking Classes',status:'Draft',sold:'00',remaining:'00',revenue:'$.00.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},
                ]

  
  constructor(
    private _formBuilder: FormBuilder,

  ) {

    this.addEventForm = this._formBuilder.group({
      event_name: ['',[Validators.required]],
      event_start_date: ['',Validators.required],
      event_start_time: ['',Validators.required],
      event_end_date: ['',Validators.required],
      event_end_time: ['',Validators.required],
    })

   }

  fnAddNewEventsForm(){

    if(!this.addEventForm.valid){
      this.addEventForm.get('event_name').markAsTouched();
      this.addEventForm.get('event_start_date').markAsTouched();
      this.addEventForm.get('event_start_time').markAsTouched();
      this.addEventForm.get('event_end_date').markAsTouched();
      this.addEventForm.get('event_end_time').markAsTouched();
      return false;
     }

     let requestObject = {
       "description" : this.addEventForm.get('event_name').value,
       "password" : this.addEventForm.get('existing_password').value
      };

  }

  ngOnInit(): void {
    
  }

 

}
