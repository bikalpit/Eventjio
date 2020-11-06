import { Component, OnInit } from '@angular/core';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-event-page-design',
  templateUrl: './event-page-design.component.html',
  styleUrls: ['./event-page-design.component.scss'],
  providers: [DatePipe]
})
export class EventPageDesignComponent implements OnInit {

  eventPageType:'listing';
  eventPageView:'desktop';
  allEventList: any;
  boxOfficeCode: any;
  boxOfficeName: any;
  frontURL:any
  isLoaderAdmin:boolean = false;
  eventId:any
  constructor(
    private SettingService:SettingService,
    private ErrorService:ErrorService,
    private datePipe: DatePipe,
  ) { 
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }
    if(localStorage.getItem('boxoffice_name')){
      this.boxOfficeName = localStorage.getItem('boxoffice_name');
    }
    this.fnGetUpcomingEventList();
  }

  ngOnInit(): void {
  }


  fnEventPageType(event){
    this.eventPageType = event.value
  }

  fnEventPageView(event){
    this.eventPageView = event.value
  }

  fnGetUpcomingEventList(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id'  :this.boxOfficeCode,
      'filter' : 'all'
    }
    this.isLoaderAdmin = true;
    this.SettingService.fnGetAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allEventList = response.response
        this.frontURL  = environment.bookingPageUrl+'/event/'+this.allEventList[0].unique_code
        this.allEventList.forEach(element => {
          element.start_date = this.datePipe.transform(element.start_date,"EEE MMM d, y")
          element.start_time = this.datePipe.transform(element.start_time,"h:mm:ss a")
          element.end_date = this.datePipe.transform(element.end_date,"EEE MMM d, y")
          element.end_time = this.datePipe.transform(element.end_time,"h:mm:ss a")
          if(element.images.length == 0)
            element.images = undefined
          });
      }else if(response.data == false){
        this.allEventList.length = 0;
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }

}
