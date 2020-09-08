import { Component } from '@angular/core';
import { Router, RouterEvent, RouterOutlet,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Ticket-Tailor';
  boxofficeComponent:boolean = false;

  constructor() {}

  isBoxoffice() {

    if (localStorage.getItem('isBoxoffice') && localStorage.getItem('isBoxoffice') == "true") {
      this.boxofficeComponent = false;
      return true;
    } else {
      this.boxofficeComponent = true;
      return false;
    }

  }

}
