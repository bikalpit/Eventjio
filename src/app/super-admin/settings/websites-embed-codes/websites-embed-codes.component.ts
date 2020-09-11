import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-websites-embed-codes',
  templateUrl: './websites-embed-codes.component.html',
  styleUrls: ['./websites-embed-codes.component.scss']
})
export class WebsitesEmbedCodesComponent implements OnInit {

  constructor() { }

  CustomiseButtonDiv : Boolean = true;
  EditButtonDiv : Boolean = true;
  bgColor = '#A207A8';
  bgTextColor = '#F8F8F8';
  headerColor ='#E72586';
  headerTextColor = 'F3F3F3';  
  btnColor = '#49DD54';
  btnTextColor = '#FFFFFF';


  CustomiseButton() {
    this.CustomiseButtonDiv = this.CustomiseButtonDiv ? false : true;
 }

 EditButton(){
   this.EditButtonDiv = this.EditButtonDiv ? false : true;
 }

  ngOnInit(): void {
  }

}
