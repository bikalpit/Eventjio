import { Component, OnInit,ElementRef, ViewChild, ViewChildren, QueryList, Renderer2, Inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { DatePipe, DOCUMENT, JsonPipe } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../_services/service.service';
import { ErrorService } from '../_services/error.service';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-preview-box-office',
  templateUrl: './preview-box-office.component.html',
  styleUrls: ['./preview-box-office.component.scss'],
  providers: [DatePipe]
})
export class PreviewBoxOfficeComponent implements OnInit {
  urlString:any;
  boxOfficeId:any
  boxOfficeEventList:any;
  boxOfficeDetail: any;
  safeHtmlTemp:any;
  currencySymbol:any;

  constructor(
    
    private datePipe: DatePipe,
    private meta: Meta,
    private readonly route: ActivatedRoute,
    private renderer2: Renderer2,
    public router: Router,
    private  ServiceService :ServiceService,
    private  ErrorService :ErrorService,
    private sanitizer:DomSanitizer
  ) {
    
    this.boxOfficeId = this.route.snapshot.params.id;
    var idddd = this.route.snapshot.paramMap.get("id");


    // console.log(window.location.search)
    //   this.urlString = window.location.search.split("?boxoffice="); 
    //   console.log(this.urlString)
    // this.boxOfficeId = window.atob(decodeURIComponent(this.urlString[1]));
    // meta.addTag({name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'});
    this.fnGetBoxOfficeEvents();
    this.fnGetBoxOfficeDetail();
    
   }

  ngOnInit(): void {
  }

  fnGetBoxOfficeEvents(){
    let requestObject = {
      'boxoffice_id' : this.boxOfficeId,
    }
    this.ServiceService.getBoxOfficeEvents(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.boxOfficeEventList = response.response;
        this.boxOfficeEventList.forEach(element => {
          element.start_date =  this.datePipe.transform(new Date(element.start_date),"EEE MMM d, y");
          if(element.online_event == 'N'){
            element.country = JSON.parse(element.country)
          }else{
            element.country = undefined
          }
          if(element.images.length === 0){
            element.images = undefined
          }
          this.transform(element.description)
        });
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
  }

  fnGetBoxOfficeDetail(){
    let requestObject = {
      'boxoffice_id' : this.boxOfficeId,
    }
    this.ServiceService.getBoxOfficeDetail(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.boxOfficeDetail = response.response;
        this.currencySymbol =this.boxOfficeDetail.currency.CurrencyCode
        console.log(this.boxOfficeDetail)
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  transform(emailTemplate) {
    this.safeHtmlTemp =  this.sanitizer.bypassSecurityTrustHtml(emailTemplate);
  }

  fnSelectEvent(eventCode){
    this.router.navigate(['/event/'+eventCode]);
  }

}
