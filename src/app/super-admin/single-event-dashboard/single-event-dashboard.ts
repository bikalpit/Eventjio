import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'single-event-dashboard',
  templateUrl: './single-event-dashboard.html',
  styleUrls: ['./single-event-dashboard.scss']
})
export class SingleEventDashboard implements OnInit {
  eventStatus:any='draft';
  eventSideMenu:boolean = true;
 
  constructor() {
    this.eventSideMenu = true;
  }

  ngOnInit(): void {
  }

  fnChangeEventStatus(status){
    this.eventStatus = status
  }

  fnClickOnDuplicate(){
    this.eventSideMenu = false;
  }

  
}


