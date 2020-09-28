import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SettingService} from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service'
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  profileImageUrl:any;
  myProfileForm:FormGroup;
  isLoaderAdmin:any;

  constructor(
    private _formBuilder: FormBuilder,
    private SettingService : SettingService,
    private ErrorService: ErrorService,
    public dialog: MatDialog,
  ) {
    this.myProfileForm = this._formBuilder.group({
      firstname : [''],
      lastname: [''],
      email:[''],
      phone:['']
    })
   }

  ngOnInit(): void {
  }

  fnChangeImage(){
    const dialogRef = this.dialog.open(DialogAdminProfileImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.profileImageUrl = result;
            console.log(result);
           }
     });
  }

  fnUploadMyProfile(){
    let uploadProfileData ={
      "firstname" : this.myProfileForm.get('firstname').value,
      "lastname" : this.myProfileForm.get('lastname').value,
      "email" : this.myProfileForm.get('email').value,
      "phone" : this.myProfileForm.get('phone').value,
    }
    this.uploadMyProfile(uploadProfileData);
  }

  uploadMyProfile(uploadProfileData){
    this.isLoaderAdmin = true;
    this.SettingService.uploadMyProfile(uploadProfileData).subscribe((response:any) => {
      if(response.data == true){
       this.ErrorService.successMessage(response.response);
        this.myProfileForm.reset();
        // this.dialogRef.close();
      }
      else if(response.data == false){
       this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
      this.myProfileForm.reset();
    })
  }




}



@Component({
  selector: 'profile-image-upload',
  templateUrl: '../_dialogs/image-upload.html',
})
export class DialogAdminProfileImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogAdminProfileImageUpload>,
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
