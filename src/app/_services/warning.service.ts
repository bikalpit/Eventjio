import { Injectable } from '@angular/core';
import { EventsComponent } from '../super-admin/events/events.component'

@Injectable({
  providedIn: 'root'
})
export class WarningService {

  constructor(
  	public events: EventsComponent
  	) { }

  getEvents() {
  	return this.events.getEvents();
  }
}
