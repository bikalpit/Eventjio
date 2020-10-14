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
  singleBoxofficeDetails:any;
  singleBoxofficeUpdate:any;
  boxofficeImageUrl:any;
  allTimezones:any;
  isLoaderAdmin:boolean = false;
  accountOwner:any = 'N';
  emailOrderNotification:any = "N";
  hideLogo:any ="N";
  


  constructor(
    private formBuilder:FormBuilder,
    private settingService:SettingService,
    private ErrorService: ErrorService,
    public dialog: MatDialog,
  ) {
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
    }
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    this.singleBoxOffice=this.formBuilder.group({
      boxoffice_name:['',[Validators.required]],
      language:[''],
      timezone:[''],
      add_email:['',Validators.pattern(emailPattern)],
      box_office_link:[''],
      account_owner:[''],

    }); 
  }

  ngOnInit(): void {
    this.getAllLanguages();
    this.getAllTimezone();
    this.getSingleBoxofficeDetails();
  }
  
  
  fnAccountOwner(event){
    if(event.checked == true){
      this.accountOwner = 'Y' 
    }else{
      this.accountOwner = 'N' 
    }
  }

  fnHideLogo(event){
    if(event.checked == true){
      this.hideLogo = 'Y' 
    }else{
      this.hideLogo = 'N' 
    }
  }

  fnEmailOrderNotification(event){
    if(event.checked == true){
      this.emailOrderNotification = 'Y' 
    }else{
      this.emailOrderNotification = 'N' 
    }
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

  fnRemoveImage(){
    
    let requestObject={
      'unique_code' : this.boxOfficeCode
    }
    this.settingService.removeImage(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.ErrorService.successMessage(response.response);
      this. getSingleBoxofficeDetails();
     
  } else if(response.data == false){
    this.ErrorService.errorMessage(response.response);
    }
  });
}

  getSingleBoxofficeDetails(){
    let requestObject = {
        'unique_code' : this.boxOfficeCode
    };
    this.settingService.getSingleBoxofficeDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.singleBoxofficeDetails = response.response[0]
        console.log(this.singleBoxofficeDetails);
        this.singleBoxOffice.controls['boxoffice_name'].setValue(this.singleBoxofficeDetails.box_office_name)
        this.singleBoxOffice.controls['box_office_link'].setValue(this.singleBoxofficeDetails.box_office_link)
        this.singleBoxOffice.controls['language'].setValue(this.singleBoxofficeDetails.language)
        this.singleBoxOffice.controls['timezone'].setValue(this.singleBoxofficeDetails.timezone)


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
  this.isLoaderAdmin = true;
  if(this.boxofficeImageUrl){
    let requestObject = {
      "country":this.singleBoxofficeDetails.country,
      "currency":this.singleBoxofficeDetails.currency,
      "genre":this.singleBoxofficeDetails.genre,
      "genre_type":this.singleBoxofficeDetails.genre_type,
      "type":this.singleBoxofficeDetails.type,
      "unique_code":this.boxOfficeCode,
      "account_owner":this.accountOwner,
      "email_order_notification":this.emailOrderNotification,
      "hide_tailor_logo": this.hideLogo,
      "box_office_name" : this.singleBoxOffice.get('boxoffice_name').value,
      "language":this.singleBoxOffice.get('language').value,
      "timezone":this.singleBoxOffice.get('timezone').value,
      "add_email":this.singleBoxOffice.get('add_email').value,
      "box_office_link":this.singleBoxOffice.get('box_office_link').value,
      "image":this.boxofficeImageUrl, 
    }  
    this.updateBoxoffice(requestObject);
   }else{
    let requestObject = { 
      "country":this.singleBoxofficeDetails.country,
      "currency":this.singleBoxofficeDetails.currency,
      "genre":this.singleBoxofficeDetails.genre,
      "genre_type":this.singleBoxofficeDetails.genre_type,
      "type":this.singleBoxofficeDetails.type,
      "unique_code":this.boxOfficeCode,
      "account_owner":this.accountOwner,
      "email_order_notification":this.emailOrderNotification,
      "hide_tailor_logo": this.hideLogo,
      "box_office_name" : this.singleBoxOffice.get('boxoffice_name').value,
      "language":this.singleBoxOffice.get('language').value,
      "timezone":this.singleBoxOffice.get('timezone').value,
      "add_email":this.singleBoxOffice.get('add_email').value,
      "box_office_link":this.singleBoxOffice.get('box_office_link').value,
    }
    this.updateBoxoffice(requestObject);
   }
  }
  
    updateBoxoffice(requestObject){
      this.settingService.updateBoxoffice(requestObject).subscribe((response:any) => {
        if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this. getSingleBoxofficeDetails();
    } else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
     this.isLoaderAdmin = false;
      this. getSingleBoxofficeDetails();
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

  

