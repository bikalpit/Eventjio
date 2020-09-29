import { Component, OnInit, Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { SettingService } from '../_services/setting.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
  boxofficeImageUrl:any;
  allTimezones:any;


  constructor(
    private formBuilder:FormBuilder,
    private settingService:SettingService,
    private ErrorService: ErrorService,
    public dialog: MatDialog,
  ) {
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
    }
    this.getAllLanguages();
    this.getAllTimezone();
    this.getBoxofficeDetails();
    
    this.singleBoxOffice=this.formBuilder.group({
      boxoffice_name:['',[Validators.required]],
      language:[''],
      timezone:[''],
      add_email:[''],

    });
    
  }

  ngOnInit(): void {
    this.getBoxofficeDetails();
  }
  
  fnChangeImage(){
    const dialogRef = this.dialog.open(DialogAdminBoxofficeImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.boxofficeImageUrl = result;
            console.log(result);
           }
     });
  }

  getBoxofficeDetails(){
    let requestObject = {
        'unique_code' : this.boxOfficeCode
    };
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
  getAllTimezone(){
    this.settingService.getAllTimezone().subscribe((response:any) => {
      if(response.data == true){
        this.allTimezones = response.response
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
    
  }

    let requestObject = {
      
      "box_office_name" : this.allBoxofficeDetails.box_office_name,
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
          this. getBoxofficeDetails();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        }
    });
  }
}


@Component({
  selector: 'boxoffice-image-upload',
  templateUrl: '../_dialogs/image-upload.html',
})
export class DialogAdminBoxofficeImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogAdminBoxofficeImageUpload>,
  private _formBuilder:FormBuilder,
  @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadForm.patchValue({
              fileSource: reader.result
          });
      };
  }
}
uploadImage() {
  this.profileImage = this.imageSrc
  this.dialogRef.close(this.profileImage);
}


}

  

