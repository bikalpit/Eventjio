import { Component, OnInit, OnChanges } from '@angular/core';
 import { Chart } from 'chart.js';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuperadminService } from '../../_services/superadmin.service';
import { ErrorService } from '../../../_services/error.service';
//import { DatePipe} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment'
@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrls: ['./event-summary.component.scss']
})
export class EventSummaryComponent implements OnInit {

  eventId:string = localStorage.getItem('selectedEventCode');
  eventDetail:any;
  eventURL;
  dataArray:any = [];
  boxOfficeDetail:any = [];

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private router: Router,
    private SuperadminService: SuperadminService,
    private SingleEventServiceService: SingleEventServiceService,

  ) {



   }
  
  

  ngOnInit(): void {
    this.fnGetEventDetail();
    this.fnGetBoxOfficeDetail();   
    this.chart_one();
   // this.chart_two();

  }
  
  chart_one(){

    let chartData = {
      "items": [
                {
                  "label":"TIcket sold",
                  "data": [0,3,0,4,0,0,5,0],
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
        labels: ["10/9", "11/9", "12/9",'13/9',"14/9", "15/9", "16/9",'17/9'],
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


    let areaChart = new Chart(document.getElementById('areaChart2') as HTMLElement, {
      type: "line",
      data: {
        labels: ["2/2020", "3/2020", "4/2020",'5/2020',"6/2020", "7/2020", "8/2020",'9/2020'],
        datasets: this.dataArray
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
        this.eventDetail = response.response[0];
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
        this.eventURL = environment.APPURL+this.boxOfficeDetail.box_office_link+'/'+this.eventId;
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
  
}
