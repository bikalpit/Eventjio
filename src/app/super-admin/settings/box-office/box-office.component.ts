import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';

@Component({
  selector: 'app-box-office',
  templateUrl: './box-office.component.html',
  styleUrls: ['./box-office.component.scss']
})
export class BoxOfficeComponent implements OnInit {
  
  showHide:any = false;
  Emailshow:boolean = false;
  iconshow:boolean = false;
  boxOfficeCode:any;
  singleBoxOffice:FormGroup;
  allLanguage:any;
  allTimezone:any;
  allBoxoffice:any;
  singleBoxofficeUpdate:any;


  constructor(
    private formBuilder:FormBuilder,
    private settingService:SettingService,
    private ErrorService: ErrorService,
  ) {
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
    }
    this.getBoxofficeDetails();
  }

  ngOnInit(): void {
    this.singleBoxOffice=this.formBuilder.group({
      boxoffice_name:['',[Validators.required]],
      languages:['',[Validators.required]],
      timeZone:['',[Validators.required]],
      email:['',[Validators.required]],
    });
  }

  getBoxofficeDetails(){
    let requestObject = {
        'unique_code' : this.boxOfficeCode,
    };
    
    this.settingService.getBoxofficeDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allBoxoffice = response.response[0]
        console.log(this.allBoxoffice);
        this.singleBoxOffice.controls['boxoffice_name'].setValue(this.allBoxoffice.box_office_name)

      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }
  
  getAllLanguages(){
    this.settingService.getAllLanguages().subscribe((response:any) => {
      if(response.data == true){
        this.allLanguage = response.response
      }
    });
  }
  
  // fnshowhide(){
  //   this.showHide =!this.showHide;
  // }

  fnshowHide(){
    this.showHide = !this.showHide;
  }

  hideEmail(){
    this.Emailshow= false;
    this.iconshow= false;
  }

  updateBoxoffice(){
    if(this.singleBoxofficeUpdate){
      let singleBoxOfficeData = {
        'unique_code': this.singleBoxofficeUpdate.unique_code,
        "box_office_name" : this.singleBoxOffice.get('title').value,
        "type" : this.singleBoxOffice.get('type').value,
        "country" : this.singleBoxOffice.get('country').value,
        "currency" : this.singleBoxOffice.get('currency').value,
        "genre" : this.singleBoxOffice.get('genre').value,
        "genre_type":this.singleBoxOffice.get('genre_type').value,
      }
        this.updateBoxoffice();
  }else{

  }


}
}
