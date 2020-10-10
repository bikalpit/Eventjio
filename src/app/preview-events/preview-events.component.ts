import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../_services/service.service'
import { ErrorService } from '../_services/error.service'
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'; 
@Component({
  selector: 'app-preview-events',
  templateUrl: './preview-events.component.html',
  styleUrls: ['./preview-events.component.scss']
})
export class PreviewEventsComponent implements OnInit {

  isLoaderAdmin:boolean = false;
  eventDetail:any = [];
  eventId:any = "";

  constructor(
    private serviceService:ServiceService,
    private errorService:ErrorService,
    private route: ActivatedRoute
  ) {

    this.eventId = this.route.snapshot.params.id;
    console.log(this.eventId);
   }

  ngOnInit(): void {
    this.getEvent();
  }

  getEvent(){


    this.isLoaderAdmin = true;
    let requestObject = {
       'unique_code' : this.eventId
    }

    this.serviceService.getSingleEvent(requestObject).subscribe((response:any) => {

      if(response.data == true){
          this.eventDetail = response.response.event[0];
          console.log(this.eventDetail);
          
      } else if(response.data == false){
        this.errorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;

    });

  }

}
