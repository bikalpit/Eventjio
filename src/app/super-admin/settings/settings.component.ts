import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  pageName :any = '';
  openEventMenuBox :boolean = false;
 
  constructor() { }

  ngOnInit(): void {
  }

  isShowDiv = false;
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
    
  }

  fnPostUrl(postUrl){
    this.pageName = postUrl; 
  }
  openEventMenu(){
    this.openEventMenuBox = this.openEventMenuBox?false :true;
  } 

}


