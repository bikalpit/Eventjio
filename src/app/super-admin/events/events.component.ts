import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

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
  
  upcomingEventData = [{event:'Lajawab Cooking Classes',status:'Draft',sold:'00',remaining:'00',revenue:'$.00.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},]
 
                pastEventData = [{event:'Lajawab Cooking Classes',status:'Draft',sold:'00',remaining:'00',revenue:'$.00.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},
                ]

  
  constructor() { }

  fnAddNewEventsForm(){
    this.addNewEvents = !this.addNewEvents;
  }

  ngOnInit(): void {
    
  }

 

}
