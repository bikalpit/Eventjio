import { Component, OnInit } from '@angular/core';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-and-ticket-types',
  templateUrl: './event-and-ticket-types.component.html',
  styleUrls: ['./event-and-ticket-types.component.scss'],
  providers: [DatePipe]
})
export class EventAndTicketTypesComponent implements OnInit {
  value = 50;
  bufferValue = 75;
  allowDonation:any;  
  redirectPage:any;
  accessCode:any;   
  salesTax:any;
  selectedEvent : any;
  singleEventDetail:any;
  allCountry:any;
  allTimeZone:any;
  allDefaultImages:any;
  fullDayTimeSlote:any;

  constructor(
    private SingleEventServiceService: SingleEventServiceService,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private router: Router,
  ) { 
    if(localStorage.getItem('selectedEventCode')){
      this.selectedEvent = localStorage.getItem('selectedEventCode')
    }
  }

  ngOnInit(): void {
    this.getSingleEvent();
    this.getAllCountry();
    this.getAllTimeZone();
    this.getDefaultImages();
    this.getTimeSlote();
  }

  
  getAllCountry(){
    this.SingleEventServiceService.getAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
      }
    });
  }

  getDefaultImages(){
    this.SingleEventServiceService.getDefaultImages().subscribe((response:any) => {
      if(response.data == true){
        this.allDefaultImages= response.response
      }
    });
  }

  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response
       // console.log(this.fullDayTimeSlote)
      }
    });
  }

  getAllTimeZone(){
    this.SingleEventServiceService.getAllTimeZone().subscribe((response:any) => {
      if(response.data == true){
        this.allTimeZone = response.response
      }
    });
  }

  getSingleEvent(){
    let requestObject = {
      'unique_code'  :this.selectedEvent,
    }
    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.singleEventDetail= response.response
       
      }
    });
  }

  

}
