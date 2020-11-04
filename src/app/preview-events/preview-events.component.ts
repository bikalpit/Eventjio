import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../_services/service.service'
import { ErrorService } from '../_services/error.service'
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'; 
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-preview-events',
  templateUrl: './preview-events.component.html',
  styleUrls: ['./preview-events.component.scss']
})
export class PreviewEventsComponent implements OnInit {

  isLoaderAdmin:boolean = false;
  eventDetail:any = [];
  eventId:any = "";
  eventStartTime:any;
  eventEndTime:any;
  eventURL:any;
  eventpageStatus:any = 'eventDetail';

  constructor(
    private serviceService:ServiceService,
    private errorService:ErrorService,
    private route: ActivatedRoute
  ) {

    this.eventId = this.route.snapshot.params.id;

  }

  ngOnInit(): void {
    this.getEvent();
  }

  nextToOrder(nextStep){
    this.eventpageStatus = nextStep;
  }

  getEvent(){
    this.isLoaderAdmin = true;
    let requestObject = {
       'unique_code' : this.eventId
    }

    this.serviceService.getSingleEvent(requestObject).subscribe((response:any) => {

      if(response.data == true){

        this.eventDetail = response.response.event[0];
        this.eventStartTime = moment(this.eventDetail.start_date + ' '+ this.eventDetail.start_time).format('MMMM Do YYYY, h:mm a');
        this.eventEndTime = moment(this.eventDetail.end_date +' '+this.eventDetail.end_time).format('MMMM Do YYYY, h:mm a');

        this.eventDetail.description = this.eventDetail.description.replace(/< \/?[^>]+>/gi, '');
        console.log(this.eventDetail.description.replace(/< \/?[^>]+>/gi, ''));
        
      } else if(response.data == false){
        this.errorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;

    });

  }


  fnShare(type) {

    this.eventURL = environment.bookingPageUrl+'/preview-events/'+this.eventId;

    if(type=='facebook'){
      window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }else if(type=='twitter'){
      window.open('https://twitter.com/intent/tweet?text='+ this.eventDetail.venue_name +' '+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }else if(type=='linkedin'){
      window.open('https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }
    
  }


}
