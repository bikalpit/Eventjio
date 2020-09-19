import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-and-ticket-types',
  templateUrl: './event-and-ticket-types.component.html',
  styleUrls: ['./event-and-ticket-types.component.scss']
})
export class EventAndTicketTypesComponent implements OnInit {
  value = 50;
  bufferValue = 75;

  constructor() { }

  ngOnInit(): void {
  }

}
