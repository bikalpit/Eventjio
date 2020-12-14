import { Component, OnInit, OnChanges } from '@angular/core';
 import { Chart } from 'chart.js';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuperadminService } from '../../_services/superadmin.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrls: ['./event-summary.component.scss'],
  providers: [DatePipe]
})
export class EventSummaryComponent implements OnInit {

  eventId:string = localStorage.getItem('selectedEventCode');
  eventDetail:any;
  eventSummery:any;
  eventURL;
  dataArray:any = [];
  boxOfficeDetail:any = [];
  Settings:any = [];
  setupStripe:boolean  = false;
  setupPayumoney:boolean  = false;
  setupPayPal:boolean  = false;
  setupOffline:boolean  = false;
  animal:any;
  isLoaderAdmin:any;
  currencycode = 'USD';
  is_show_referral_data = false;
  
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private router: Router,
    private SuperadminService: SuperadminService,
    private SingleEventServiceService: SingleEventServiceService,
    private datePipe:DatePipe,

  ) {}
  
  

  ngOnInit(): void {
    this.fnGetEventDetail();
    this.fnGetBoxOfficeDetail();   
    this.fnGetSettings();
  }
  
  fnChartView(data,arrayLable){

    let chartData = {
      "items": [
          {
            "label":"TIcket sold",
            "data": data,
            "backgroundColor": "#D9EBFF",
            "borderColor": "rgb(40,100,200)",
            "fill": true,
            "lineTension": 0,
            "radius": 5
          }
      ]
    }

    for(let key in chartData.items){
      if(chartData.items.hasOwnProperty(key)){
        this.dataArray.push(chartData.items[key])
      }
    } 


    let chart  = new Chart(document.getElementById('areaChart1') as HTMLElement, {
      type: "line",
      data: {
        labels: arrayLable,
        datasets: this.dataArray
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          position: "left",
          text:"TIcket sold",
          fontSize:12,
          fontColor: "#666"
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#999",
            fontSize: 14
          }
        }
      }
    });

  }


  fnChartView2(data,arrayLable){

    let chartData = {
      "items": [
                {
                  "label":"TIcket sold",
                  "data": data,
                  "backgroundColor": "#D9EBFF",
                  "borderColor": "rgb(40,100,200)",
                  "fill": true,
                  "lineTension": 0,
                  "radius": 5
                }
        ]
    }

    let dataArray1:any = [];

    for(let key in chartData.items){
      if(chartData.items.hasOwnProperty(key)){
        dataArray1.push(chartData.items[key])
      }
    } 

 

    let areaChart = new Chart(document.getElementById('areaChart2') as HTMLElement, {
      type: "line",
      data: {
        labels: arrayLable,
        datasets: dataArray1
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          position: "left",
          text:"Event Views",
          fontSize:12,
          fontColor: "#666"
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            fontColor: "#999",
            fontSize: 14
          }
        }
      }
    });

  }


  fnGetEventDetail(){

    let requestObject = {
      'unique_code' : this.eventId,
    }
    
    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventDetail = response.response.event[0];
        this.currencycode = this.eventDetail.event_setting.currency ? this.eventDetail.event_setting.currency  : 'USD'
        // console.log(this.currencycode);
        // console.log(this.eventDetail);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    let request = {
      'event_id' : this.eventId,
    }

    this.SingleEventServiceService.getSingleSummery(request).subscribe((response:any) => {
      if(response.data == true){
        this.eventSummery = response.response;

        let data = [];
        let arrayLable = [];
        if(this.eventSummery.graphSale){
          this.eventSummery.graphSale.forEach(element => {
            data.push(element.sale);
            arrayLable.push(element.date);
          });
          this.fnChartView(data,arrayLable);
        }

        data = [];
        arrayLable = [];

        if(this.eventSummery.graphViews){
          this.eventSummery.graphViews.forEach(element => {
            data.push(element.sale);
            arrayLable.push(element.date);
          });
          this.fnChartView2(data,arrayLable);
        }
        

      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });


  }

  fnGetBoxOfficeDetail(){

    let requestObject = {
      'unique_code' : localStorage.getItem('boxoffice_id'),
    }

    this.SingleEventServiceService.getSingleBoxofficeDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.boxOfficeDetail = response.response[0];
        this.eventURL = environment.bookingPageUrl+'/event/'+this.eventId;
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  fnGetSettings(){

    let requestObject={
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "event_id" : ''
    }

    this.SingleEventServiceService.getSettingsValue(requestObject).subscribe((response:any) => {

        if(response.data == true){
          this.boxOfficeDetail = response.response;
          this.boxOfficeDetail.forEach(element => {
            if(element.option_key == 'Stripe'){
              this.setupStripe = true;
            }
            if(element.option_key == 'Paypal'){
              this.setupPayPal = true;
            }
            if(element.option_key == 'Payumoney'){
              this.setupPayumoney = true;
            }
          });

        } else if(response.data == false){

          this.ErrorService.errorMessage(response.response);
        }
    });

  }

  fnShare(type) {
    if(type=='facebook'){
      window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }else if(type=='twitter'){
      window.open('https://twitter.com/intent/tweet?text='+ this.eventDetail.venue_name +' '+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }
  }

  
  PreviewPage(){
    window.open(this.eventURL,'_blank');
  }

  createTrackingLinkandView() {
    this.isLoaderAdmin = true;
    const dialogRef = this.dialog.open(createTrackingLinkAndView, {
      width: '550px',
    });
  
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
     this.isLoaderAdmin = false;
  }
  
}



@Component({
  selector: 'add-create-tracking-link-and-view',
  templateUrl: '../_dialogs/create-tracking-link-and-view.html',
})
export class createTrackingLinkAndView implements OnInit {
  isLoaderAdmin:any;
  trackingLinkandViewForm:FormGroup;
  trackingLinkandViewArr:FormArray;
  trackingLinkandView = [];
  trackingLinkandViewValue =[{
    event:'',
    referralTag:'',
  }]

constructor(
  private _formBuilder : FormBuilder,
  public dialogRef: MatDialogRef<createTrackingLinkAndView>,
){
  this.trackingLinkandViewForm = this._formBuilder.group({
    trackingLinkandViewArr : this._formBuilder.array([this.createTrackingLinkandViewItem()])
  })
}

createTrackingLinkandViewItem() {
  return this._formBuilder.group({
    event: [''],
    referralTag: ['']
  })
}

fntrackingLinkandViewAdd(){
  this.trackingLinkandViewArr = this.trackingLinkandViewForm.get('trackingLinkandViewArr') as FormArray;
  this.trackingLinkandViewArr.push(this.createTrackingLinkandViewItem());
  this.trackingLinkandView = this.trackingLinkandViewForm.value.trackingLinkandViewArr;
}

onNoClick(){
  this.dialogRef.close();
}
ngOnInit():void{
}

}
