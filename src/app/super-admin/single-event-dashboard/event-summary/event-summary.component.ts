import { Component, OnInit, OnChanges } from '@angular/core';
import * as CanvasJS from '../../../../assets/canvasjs.min';
@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrls: ['./event-summary.component.scss']
})
export class EventSummaryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.fnTicketsales();   
    this.fnEventView();
  }

  

  fnTicketsales() : void{
    window.onload = function () {

      var ticket = new CanvasJS.Chart("ticketsales", {
        animationEnabled: true,
        theme: "light2",
        // title:{
        //   text: "Simple Line Chart"
        // },
        data: [{        
          type: "line",
              indexLabelFontSize: 16,
          dataPoints: [
            { y: 450 },
            { y: 414},
            { y: 520 },
            { y: 460 },
            { y: 450 },
            { y: 500 },
            { y: 480 },
            { y: 480 },
            { y: 500 },
            { y: 480 },
            { y: 510 }
          ]
        }]
      });
      
      ticket.render();
      
      }
  }

  fnEventView(): void{
    window.onload = function () {

      var event = new CanvasJS.Chart("eventview", {
        animationEnabled: true,
        theme: "light2",
        // title:{
        //   text: "Simple Line Chart"
        // },
        data: [{        
          type: "line",
              indexLabelFontSize: 16,
          dataPoints: [
            { y: 450 },
            { y: 414},
            { y: 520 },
            { y: 460 },
            { y: 450 },
            { y: 500 },
            { y: 480 },
            { y: 480 },
            { y: 500 },
            { y: 480 },
            { y: 510 }
          ]
        }]
      });
      
      event.render();
      
      }
  }

}
