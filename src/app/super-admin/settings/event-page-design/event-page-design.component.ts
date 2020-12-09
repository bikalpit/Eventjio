import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment'; 
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-event-page-design',
  templateUrl: './event-page-design.component.html',
  styleUrls: ['./event-page-design.component.scss'],
  providers: [DatePipe]
})
export class EventPageDesignComponent implements OnInit {

  eventPageType:any='listing';
  eventPageView:any = 'desktop';
  selectedFont:any ='Roboto, sans-serif';
  allEventList: any;
  boxOfficeId: any;
  boxOfficeName: any;
  eventImage:any;
  frontURL:any
  isLoaderAdmin:boolean = false;
  eventId:any;
  eventStartTime:any;
  eventEndTime:any;
  eventDetail:any;
  eventDiscriptionHtml:any;
  customizerThemePanel:boolean=false;
  themeAppearanceColor:any;
  selectedTheme:any= 'theme1';
  headerColor = '#A207A8';
  headerTextColor = '#F3F3F3';  
  pageColor = '#F8F8F8';
  pageTextColor ='#E72586';
  btnColor = '#49DD54';
  btnTextColor = '#FFFFFF';
  bgColor = '#FFFFFF';
  singleEventOnline:boolean= false;
  themeSelectionOption:any = 'themeSelection';
  constructor(
    private SettingService:SettingService,
    private ErrorService:ErrorService,
    private datePipe: DatePipe,
    private change : ChangeDetectorRef,
    private sanitizer:DomSanitizer,
  ) { 
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeId = localStorage.getItem('boxoffice_id');
    }
    if(localStorage.getItem('boxoffice_name')){
      this.boxOfficeName = localStorage.getItem('boxoffice_name');
    }
    this.fnGetUpcomingEventList();
    this.getThemeAppearanceColor();
  }

  ngOnInit(): void {
  }


  fnEventPageType(event){
    this.eventPageType = event.value;
    if(event.value == 'single' && this.allEventList){

      this.getEvent(this.allEventList[0].unique_code);
    }
  }

  fnEventPageView(event){
    this.eventPageView = event.value
  }

  fnGetUpcomingEventList(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id'  :this.boxOfficeId,
      'filter' : 'all'
    }
    this.SettingService.fnGetAllEventListView(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allEventList = response.response;
        this.getEvent(this.allEventList[0].unique_code);
        this.frontURL  = environment.bookingPageUrl+'/event/'+this.allEventList[0].unique_code
        this.allEventList.forEach(element => {
          if(element.images.length == 0){
            element.images = undefined
          }
          element.start_date = this.datePipe.transform(element.start_date,"EEE MMM d, y")
          // element.start_time = this.datePipe.transform(element.start_time,"h:mm:ss a")
          // element.end_date = this.datePipe.transform(element.end_date,"EEE MMM d, y")
          // element.end_time = this.datePipe.transform(element.end_time,"h:mm:ss a")
          if(element.images.length == 0)
            element.images = undefined
          });
      }else if(response.data == false){
        this.allEventList = undefined;
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }

  fnChangeTheme(theme){
    this.selectedTheme = theme;
  }

  fnThemeDirection(direction){
      this.themeSelectionOption =direction;
  }

  fnChangeFont(event){
    this.selectedFont = event.value
  }

  getThemeAppearanceColor(){
    let requestObject ={
      'boxoffice_id' : this.boxOfficeId,
      'event_id' :'NULL',
      'option_key':'themeColorAppearance',
    }
    this.isLoaderAdmin = true;
    this.SettingService.getSettingsValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.themeAppearanceColor = JSON.parse(response.response)
        this.selectedFont = this.themeAppearanceColor.font;
        this.bgColor = this.themeAppearanceColor.bgColor;
        this.pageColor = this.themeAppearanceColor.pageColor;
        this.pageTextColor = this.themeAppearanceColor.pageTextColor;
        this.headerColor = this.themeAppearanceColor.headerColor;
        this.headerTextColor = this.themeAppearanceColor.headerTextColor;
        this.btnColor = this.themeAppearanceColor.btnColor;
        this.btnTextColor = this.themeAppearanceColor.btnTextColor;
        this.selectedTheme = this.themeAppearanceColor.theme;
        localStorage.companycolours=JSON.stringify(this.themeAppearanceColor);
          this.update_SCSS_var();
     
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
      this.isLoaderAdmin = false;
  }

  
  fnUpadateThemeAppearanceColor(){
      let themeAppearance = {
        "font":this.selectedFont,
        "bgColor":this.bgColor,
        "pageColor":this.pageColor,
        "pageTextColor":this.pageTextColor,
        "headerColor":this.headerColor,
        "headerTextColor":this.headerTextColor,
        "btnColor":this.btnColor,
        "btnTextColor":this.btnTextColor,
        'theme': this.selectedTheme
      }
      let requestObject = {
        "boxoffice_id"  : this.boxOfficeId,
        "option_key"    :  "themeColorAppearance",
        "option_value" : themeAppearance,
        "event_id" :  null,
        'json_type' : 'Y'
      }
      this.updateThemeAppearance(requestObject);

  }

  updateThemeAppearance(requestObject){
    this.isLoaderAdmin = true;
    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.getThemeAppearanceColor();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
  }


  update_SCSS_var() {
    const data = JSON.parse(localStorage.companycolours);
    for (const [key, value] of Object.entries(data)) {
      this.setPropertyOfSCSS('--' + key, value);
      // document.documentElement.style.setProperty('--' + key, value);
    }
  }

  setPropertyOfSCSS(key, value) {
    if (key[0] != '-') {
      key = '--' + key;
    }
    if (value) {
      document.documentElement.style.setProperty(key, value);
    }
    return getComputedStyle(document.documentElement).getPropertyValue(key);
  }


  getEvent(unique_code){
    this.isLoaderAdmin = true;
    let requestObject = {
       'unique_code' : unique_code
    }

    this.SettingService.getSingleEvent(requestObject).subscribe((response:any) => {

      if(response.data == true){

        this.eventDetail = response.response.event[0];
        this.eventStartTime = moment(this.eventDetail.start_date + ' '+ this.eventDetail.start_time).format('MMMM Do YYYY, h:mm a');
        this.eventEndTime = moment(this.eventDetail.end_date +' '+this.eventDetail.end_time).format('MMMM Do YYYY, h:mm a');
        this.eventDiscriptionHtml = this.sanitizer.bypassSecurityTrustHtml(this.eventDetail.description);

        this.eventDetail.description = this.eventDetail.description.replace(/< \/?[^>]+>/gi, '');
        console.log(this.eventDetail.description.replace(/< \/?[^>]+>/gi, ''));
        if(this.eventDetail.online_event == 'Y'){
          this.singleEventOnline = true;
        }else{
          this.singleEventOnline = false;
        }

        if(this.eventDetail.images[0]){
          this.eventImage = this.eventDetail.images[0].image;
        }else{
          this.eventImage = '/assets/images/Event-preview/preview-main.png';
        }
        this.change.detectChanges();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;

    });

  }

}
