import { Component, OnInit, OnChanges } from '@angular/core';
// import { ChartDataSets, ChartOptions } from 'chart.js';
// import { Color, Label } from 'ng2-charts';
// import * as CanvasJS from '../../../../assets/canvasjs.min';

@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrls: ['./event-summary.component.scss']
})
export class EventSummaryComponent implements OnInit {


  
  constructor() { }

  ngOnInit(): void {
    // this.fnTicketsales();   
    // this.fnEventView();
  }

  // lineChartData: ChartDataSets[] = [
  //   { data: [85, 72, 78, 75, 77, 75], label: 'Crude oil prices' },
  // ];

  // lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];

  // lineChartOptions = {
  //   responsive: true,
  // };

  // lineChartColors: Color[] = [
  //   {
  //     borderColor: 'black',
  //     backgroundColor: 'rgba(255,255,0,0.28)',
  //   },
  // ];

  // lineChartLegend = true;
  // lineChartPlugins = [];
  // lineChartType = 'line';

  

  // fnTicketsales() : void{
  //   window.onload = function () {

  //     var ticket = new CanvasJS.Chart("ticketsales", {
  //       animationEnabled: true,
  //       theme: "light2",
  //       // title:{
  //       //   text: "Simple Line Chart"
  //       // },
  //       data: [{        
  //         type: "line",
  //             indexLabelFontSize: 16,
  //         dataPoints: [
  //           { y: 450 },
  //           { y: 414},
  //           { y: 520 },
  //           { y: 460 },
  //           { y: 450 },
  //           { y: 500 },
  //           { y: 480 },
  //           { y: 480 },
  //           { y: 500 },
  //           { y: 480 },
  //           { y: 510 }
  //         ]
  //       }]
  //     });
      
  //     ticket.render();
      
  //     }
  // }

//   fnEventView(): void{
//     window.onload = function () {

//       var event = new CanvasJS.Chart("eventview", {
//         animationEnabled: true,
//         theme: "light2",
//         // title:{
//         //   text: "Simple Line Chart"
//         // },
//         data: [{        
//           type: "line",
//               indexLabelFontSize: 16,
//           dataPoints: [
//             { y: 450 },
//             { y: 414},
//             { y: 520 },
//             { y: 460 },
//             { y: 450 },
//             { y: 500 },
//             { y: 480 },
//             { y: 480 },
//             { y: 500 },
//             { y: 480 },
//             { y: 510 }
//           ]
//         }]
//       });
      
//       event.render();
      
//       }
//   }

}
