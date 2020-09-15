import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-box-office',
  templateUrl: './box-office.component.html',
  styleUrls: ['./box-office.component.scss']
})
export class BoxOfficeComponent implements OnInit {
  Emailshow:boolean = false;
  iconshow:boolean = false;


  constructor() { }

  ngOnInit(): void {
  }

  showEmail(){
    this.Emailshow= true;
    this.iconshow= true;
  }

  hideEmail(){
    this.Emailshow= false;
    this.iconshow= false;
  }
}
