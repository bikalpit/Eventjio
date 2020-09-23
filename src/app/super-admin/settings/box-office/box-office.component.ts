import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-box-office',
  templateUrl: './box-office.component.html',
  styleUrls: ['./box-office.component.scss']
})
export class BoxOfficeComponent implements OnInit {
  
  showHide:any = false;


  constructor() { }

  ngOnInit(): void {
  }

  fnshowHide(){
    this.showHide = !this.showHide;
  }

  
}
