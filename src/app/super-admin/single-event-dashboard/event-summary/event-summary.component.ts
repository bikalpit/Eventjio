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

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private router: Router,
    private SuperadminService: SuperadminService,
    private SingleEventServiceService: SingleEventServiceService,

  ) {

    this.eventURL = environment.APPURL+this.eventId;

   }
  
  

  ngOnInit(): void {
    this.fnGetEventDetail();
    // this.fnTicketsales();   
    // this.fnEventView();
  }
  
  ngAfterViewInit(){

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

    let data:any,
    options:any,
    chart:any,
    ctx:any = document.getElementById('areaChart') as HTMLElement;

        for(let key in chartData.items){
          if(chartData.items.hasOwnProperty(key)){
            this.dataArray.push(chartData.items[key])
          }
        } // Stackblitz errors. Don't get these in VS Code

        data = {
          labels: ["10/9", "11/9", "12/9",'13/9',"14/9", "15/9", "16/9",'17/9'],
          datasets: this.dataArray
        }

        options = {
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

        chart  = new Chart(ctx, {
          type: "line",
          data: data,
          options: options
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

  fnShare(type) {
    if(type=='facebook'){
      window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }else if(type=='twitter'){
      window.open('https://twitter.com/intent/tweet?text='+ this.eventDetail.venue_name +' '+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }
  }




}
