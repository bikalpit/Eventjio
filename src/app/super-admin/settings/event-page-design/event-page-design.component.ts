import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-page-design',
  templateUrl: './event-page-design.component.html',
  styleUrls: ['./event-page-design.component.scss']
})
export class EventPageDesignComponent implements OnInit {
  eventdata = [{eventname:'The Ladies Kitty Party', eventdatetime:'Mon 29 Aug 2020 8:00pm - 10:30pm', eventlocation:'The Grand Hayatt - 400001'},
               {eventname:'Vempire Party', eventdatetime:'Mon 29 Aug 2020 8:00pm - 10:30pm', eventlocation:'The Grand Hayatt - 400001'}
              ]
  constructor() { }

  ngOnInit(): void {
  }

}
