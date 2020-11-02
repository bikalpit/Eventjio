import { Component, OnInit,ElementRef, ViewChild, ViewChildren, QueryList, Renderer2, Inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { DatePipe, DOCUMENT, JsonPipe } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ServiceService } from '../_services/service.service';
import { ErrorService } from '../_services/error.service';

@Component({
  selector: 'app-preview-box-office',
  templateUrl: './preview-box-office.component.html',
  styleUrls: ['./preview-box-office.component.scss'],
  providers: [DatePipe]
})
export class PreviewBoxOfficeComponent implements OnInit {
  urlString:any;
  boxOfficeId:any
  boxOfficeDetail:any;

  constructor(
    
    private datePipe: DatePipe,
    private meta: Meta,
    private renderer2: Renderer2,
    public router: Router,
    private  ServiceService :ServiceService,
    private  ErrorService :ErrorService,
  ) {
    console.log(window.location.search)
      this.urlString = window.location.search.split("?boxoffice="); 
      console.log(this.urlString)
    this.boxOfficeId = window.atob(decodeURIComponent(this.urlString[1]));
    meta.addTag({name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'});
    this.fnGetBoxOfficeDetail();
    
   }

  ngOnInit(): void {
  }

  fnGetBoxOfficeDetail(){

    let requestObject = {
      'unique_code' : this.boxOfficeId,
    }
    this.ServiceService.getSingleBoxOffice(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.boxOfficeDetail = response.response[0];
        console.log(this.boxOfficeDetail)
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

}
