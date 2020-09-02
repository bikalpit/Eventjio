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
  
  CustomiseButton() {
    this.CustomiseButtonDiv = this.CustomiseButtonDiv ? false : true;
 }

 EditButton(){
   this.EditButtonDiv = this.EditButtonDiv ? false : true;
 }

  ngOnInit(): void {
  }

}
