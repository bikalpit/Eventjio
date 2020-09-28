import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
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
  allBoxofficeDetails:any;
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
      language:[''],
      timezone:[''],
      add_email:[''],

    });
  }

  getBoxofficeDetails(){
    let requestObject = {
        'unique_code' : this.boxOfficeCode
    };
    alert(this.boxOfficeCode);
    this.settingService.getBoxofficeDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allBoxofficeDetails = response.response[0]
        console.log(this.allBoxofficeDetails);
        this.singleBoxOffice.controls['boxoffice_name'].setValue(this.allBoxofficeDetails.box_office_name)

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
    this.Emailshow= true;
  }

  hideEmail(){
    this.Emailshow= false;
    this.iconshow= false;
  }


fnSubmitBoxOffice(){
  if(this.singleBoxOffice.invalid){
    alert("1");
  }

    let requestObject = {
      
      "box_office_name" : this.singleBoxOffice.get('box_office_name').value,
      "country":this.allBoxofficeDetails.country,
      "currency":this.allBoxofficeDetails.currency,
      "genre":this.allBoxofficeDetails.genre,
      "genre_type":this.allBoxofficeDetails.genre_type,
      "type":this.allBoxofficeDetails.type,
      "unique_code":this.boxOfficeCode,
      "language":this.singleBoxOffice.get('language').value,
      "timezone":this.singleBoxOffice.get('timezone').value,
      "add_email":this.singleBoxOffice.get('add_email').value,
      
    }
        this.settingService.updateBoxoffice(requestObject).subscribe((response:any) => {
          if(response.data == true){
          this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        }
    });
  }
}
  

