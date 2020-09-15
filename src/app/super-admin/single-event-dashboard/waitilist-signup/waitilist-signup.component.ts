import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waitilist-signup',
  templateUrl: './waitilist-signup.component.html',
  styleUrls: ['./waitilist-signup.component.scss']
})
export class WaitilistSignupComponent implements OnInit {
  activeWaitlist:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

  fnActiveWaitlist(event){
    this.activeWaitlist=event.checked
  }


}
