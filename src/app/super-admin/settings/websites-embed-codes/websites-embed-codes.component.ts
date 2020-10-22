import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-websites-embed-codes',
  templateUrl: './websites-embed-codes.component.html',
  styleUrls: ['./websites-embed-codes.component.scss']
})
export class WebsitesEmbedCodesComponent implements OnInit {

  embededCode:any;
  boxOfficeId:any;
  constructor() { 
    if (localStorage.getItem('boxoffice_id')) {
      this.boxOfficeId = localStorage.getItem('boxoffice_id');
      
      // const enc = new Base64();   
      // this.encodedBusinessId = enc.encode(this.businessId);
      // console.log(this.encodedBusinessId);
      this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='"+environment.urlForLink+"/box-office/?boxoffice="+window.btoa(this.boxOfficeId)+"'></iframe>";
      
    }
  }

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
