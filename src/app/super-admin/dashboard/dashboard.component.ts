import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../_services/authentication.service';
import { Chart } from 'chart.js';
import { Router, RouterEvent, RouterOutlet,ActivatedRoute } from '@angular/router';
import { SuperadminService } from '../_services/superadmin.service';
import { ErrorService } from '../../_services/error.service';
import { DatePipe} from '@angular/common';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {

  currentUser:any;
  isLoaderAdmin:boolean = false;
  eventPermission:boolean = false;
  pageSlug:any;
  keepMe:any;
  analyticsFilter:any="week";
  salesFilter:any="week";
  boxOfficeCode:any;
  setupSteps:any;
  analyticsStets:any;
  recentPurchaseList:any=[];
  latestSalesStats:any;
  initials:any;
  customerShortName:any;
  ipAddress:any;
  upcommintEventApiUrl:any =  `${environment.apiUrl}/get-allboxoffice-event-api`;
  allUpcomingEventListData:any=[];
  totalUpcomingEvents:any;
  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private SuperadminService: SuperadminService,

  ) { 
    this.keepMe = localStorage.getItem('keepMeSignIn')
    if (this.keepMe == 'true') {
      this.currentUser =  JSON.parse(localStorage.getItem('currentUser'))
    } else {
      this.currentUser =  JSON.parse(sessionStorage.getItem('currentUser'))
    }




    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }
    // this.currentUser = JSON.parse(this.currentUser);

    if(this.currentUser.type == 'member'  && this.currentUser.permission != 'A'){
      if(localStorage.getItem('permision_OV') != 'TRUE'){
        this.router.navigate(['/super-admin']);
      }
       if (localStorage.getItem('permision_OV')) {
        this.eventPermission = false;
      }

      if (localStorage.getItem('permision_EM')) {
        this.eventPermission = true;
      }

    }
    this.router.events.subscribe(event => {
      if (event instanceof RouterEvent) this.handleRoute(event);
        const url = this.getUrl(event);
    });

    
   this.getSetupSteps();
   this.getAnalytics();
   this.getRecentPurchase();
   this.getLatestSales();
    this.fnGetUpcomingEventList();
    
  }

  ngOnInit(): void {
    this.fnSoldTicketChart();

  }

  // page url conditions
  dynamicSort(property: string) {
    let sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return (a, b) => {
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }
  private getUrl(event: any) {
    if (event && event.url) {
      this.pageSlug = event.url.split('/' , 2)
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    let devidedUrl = url.split('/',4);
    if(devidedUrl[1] == '' || devidedUrl[1] == 'boxoffice'){
      localStorage.setItem('isBoxoffice','true');
    }else{
      localStorage.setItem('isBoxoffice','false');
    }
  }

  getSetupSteps(){
    let requestObject  ={
      'boxoffice_id': this.boxOfficeCode
    }
    this.SuperadminService.getSetupSteps(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.setupSteps= response.response
      }
    });
  }

  fnChangeFilterAnalytics(){
    this.getAnalytics();
  }

  getAnalytics(){
    let requestObject  ={
      'boxoffice_id': this.boxOfficeCode,
      'type': this.analyticsFilter
    }
    this.SuperadminService.getAnalytics(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.analyticsStets= response.response
      }
    });
  }
 
  getRecentPurchase(){
    let requestObject  ={
      'boxoffice_id': this.boxOfficeCode,
    }
    this.SuperadminService.getRecentPurchase(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.recentPurchaseList= response.response
        this.recentPurchaseList.forEach(element => {
          element.customer.customerShortName = ''
          element.customer.customerShortName = element.customer.firstname.charAt(0)+ element.customer.lastname.charAt(0)
        });
        console.log(this.recentPurchaseList)
        
      }
    });
  }

  fnChangeFilterSales(){
    this.getLatestSales();
  }
 
  getLatestSales(){
    let requestObject  ={
      'boxoffice_id': this.boxOfficeCode,
      'type': this.salesFilter
    }
    this.SuperadminService.getLatestSales(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.latestSalesStats= response.response
        if(this.latestSalesStats.ticket_left != 0 && this.latestSalesStats.ticket_sold != 0){
          this.fnSoldTicketChart();
        }
      }
    });
  }
  
  addNewEvent(){
    // this.EventsComponent.addNewEvent();
    this.router.navigate(['/super-admin/events'], { queryParams: { event: 'new' } });  
    // this.router.navigate(['/super-admin/events?event=new']);
  }

  viewAllEvent(){
    this.router.navigate(['/super-admin/events']); 
  }

  fnGetUpcomingEventList(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id'  :this.boxOfficeCode,
    }
    this.SuperadminService.dashboarUpcomingEvents(requestObject).subscribe((response:any) => {
      if(response.data == true){
        
        // this.allUpcomingEventListData = response.response.data;
        this.totalUpcomingEvents = response.response.length;
        let i =0;
        response.response.forEach(element => {
          element.shortStartDate = '';
          element.shortStartDate = this.datePipe.transform(new Date(element.start_date),"d");
          element.shortStartDay = this.datePipe.transform(new Date(element.start_date),"EE");
          i++
          if(i < 4){
            this.allUpcomingEventListData.push(element)
          }
          console.log(i)
        });
        console.log(this.allUpcomingEventListData)

        // this.addNewEvents = true;
      }else if(response.data == false){
        this.allUpcomingEventListData.length = 0;
      }
        this.isLoaderAdmin = false;
    });
  }

  fnSoldTicketChart(){
  let chart  = new Chart(document.getElementById('ticketchart') as HTMLElement, {
    type: 'doughnut',
    data: {
      labels: ['Ticket Left','Ticket Sold'],
      datasets: [
        { 
          data: [this.latestSalesStats.ticket_left,this.latestSalesStats.ticket_sold],
          backgroundColor: ['rgb(238, 181, 48)','rgb(112, 192, 193)'],
          fill: true
        },
      ]
    },
    options: {
      legend: {
        display: false,
      },
      tooltips:{
        enabled:true
      }
    }
  });
}

}
