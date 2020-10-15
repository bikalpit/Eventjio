import { Component, OnInit,Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuperadminService } from '../_services/superadmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorService } from '../../_services/error.service';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router, RouterOutlet ,ActivatedRoute} from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../../_services/authentication.service';
import { environment } from '../../../environments/environment';
import { ExportToCsv } from 'export-to-csv';
import { DatePipe} from '@angular/common';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [DatePipe]
})
export class CustomersComponent implements OnInit {
  addCustomerForm:FormGroup;
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  boxofficeId:any;
  customerDetails:any;
  selectedCustomerDetails:any;
  selectedCustomerCode:any;
  editCustomerForm:boolean = false;
  deleteCustomer:any;
  isLoaderAdmin:boolean = false;
  selectedCustomerArr:any;
  addFormButtonDiv : boolean = true;
  customerImageUrl:any;
  allEventListData:any;
  search = {
    keyword: ""
  };

  constructor(
    private formBuilder:FormBuilder,
    private SuperadminService : SuperadminService,
    public router: Router,
    private ErrorService: ErrorService,
    public dialog: MatDialog,
    private _snackBar:MatSnackBar,
    private datePipe: DatePipe,
  ) {
    if(localStorage.getItem('boxoffice_id')){
      this.boxofficeId = localStorage.getItem('boxoffice_id');   
    }
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/ 
    this.addCustomerForm = this.formBuilder.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      phone:['',[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
      email:['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
      // image:[''],
      address:['',Validators.required],
      tags:['',Validators.required],
    });  
   }

   onTabChange(event){
    let clickedIndex = event.index;
    if(clickedIndex == 0){      
    }else if(clickedIndex == 1){      
    }
  }
   

  addFormButton(){
    this.addFormButtonDiv = this.addFormButtonDiv ? false : true;
    this.addCustomerForm.reset();
    this.customerImageUrl = undefined;
    
  }

  customerSearch(){
    this. getAllCustomersDetails();
  }
  
  ngOnInit(): void {
    this.getAllCustomersDetails();
  }

  ImportFileUpload() {
    const dialogRef = this.dialog.open(DialogImportFileUpload, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
        // if(result != undefined){
        //     this.subCategoryImageUrl = result;
        //     console.log(result);
        //    }
     });
  }
  fnChangeImage(){
    const dialogRef = this.dialog.open(DialogCustomerImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.customerImageUrl = result;
            console.log(result);
           }
     });
  }


  submitForm(){
    if(this.addCustomerForm.invalid){
      this.addCustomerForm.get("firstname").markAsTouched();
      this.addCustomerForm.get("lastname").markAsTouched();
      this.addCustomerForm.get("phone").markAsTouched();
      this.addCustomerForm.get("email").markAsTouched();
      this.addCustomerForm.get("address").markAsTouched();
      this.addCustomerForm.get("tags").markAsTouched();
      // alert(1);
      return false;
    }else{
      if(this.editCustomerForm == true){
        if(this.customerImageUrl){
          let requestObject={
            "firstname":this.addCustomerForm.get('firstname').value,
            "lastname":this.addCustomerForm.get('lastname').value,
            "email":this.addCustomerForm.get('email').value,
            "phone":this.addCustomerForm.get('phone').value,
            "image": this.customerImageUrl,
            "address":this.addCustomerForm.get('address').value,
            "unique_code": this.selectedCustomerCode,
            "tags": this.addCustomerForm.get("tags").value,
            "boxoffice_id": this.boxofficeId,
          };
          this.fnUpdateCustomer(requestObject)
        }else{
          let requestObject={
            "firstname":this.addCustomerForm.get('firstname').value,
            "lastname":this.addCustomerForm.get('lastname').value,
            "email":this.addCustomerForm.get('email').value,
            "phone":this.addCustomerForm.get('phone').value,
            "address":this.addCustomerForm.get('address').value,
            "unique_code": this.selectedCustomerCode,
            "tags": this.addCustomerForm.get("tags").value,
            "boxoffice_id": this.boxofficeId,
          };
          this.fnUpdateCustomer(requestObject)
        }
      }else if(this.editCustomerForm == false){
        if(this.customerImageUrl){
          let requestObject={
            "firstname": this.addCustomerForm.get("firstname").value,
            "lastname": this.addCustomerForm.get("lastname").value,
            "phone": this.addCustomerForm.get("phone").value,
            "email": this.addCustomerForm.get("email").value,
            "address": this.addCustomerForm.get("address").value,
            "tags": this.addCustomerForm.get("tags").value,
            "image": this.customerImageUrl,
            "boxoffice_id": this.boxofficeId,
          }
          this.fnCreateCustomer(requestObject)
        }else{
          let requestObject={
            "firstname": this.addCustomerForm.get("firstname").value,
            "lastname": this.addCustomerForm.get("lastname").value,
            "phone": this.addCustomerForm.get("phone").value,
            "email": this.addCustomerForm.get("email").value,
            "address": this.addCustomerForm.get("address").value,
            "tags": this.addCustomerForm.get("tags").value,
            "boxoffice_id": this.boxofficeId,
          }
          this.fnCreateCustomer(requestObject)
        }
      }
    }
  }
  

  fnCreateCustomer(requestObject){
    this.SuperadminService.createCustomersForm(requestObject).subscribe((response:any) => {
    if(response.data == true){
      this.ErrorService.successMessage(response.response);
      this.getAllCustomersDetails();
      this.addFormButtonDiv = this.addFormButtonDiv ? false : true;
    }else if(response.data == false){
      this.ErrorService.errorMessage(response.response);     
      }
    });
 }

 
 getAllCustomersDetails(){
  this.isLoaderAdmin = true;
    let requestObject ={
      'search':this.search.keyword,
      "boxoffice_id": this.boxofficeId,
    };
     
    this.SuperadminService.getAllCustomersDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.customerDetails = response.response
        this.selectedCustomerCode=  this.customerDetails[0].unique_code
       this.fnSelectCustomer(this.selectedCustomerCode)
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        this.customerDetails = null;
        this.addFormButtonDiv = false;
      }
      this.isLoaderAdmin = false;
    });
}

 editCustomerDetails(){
  

  this.addFormButtonDiv = this.addFormButtonDiv ? false : true;  
  this.editCustomerForm = true;
  let requestObject = {
    "unique_code": this.selectedCustomerCode,
  };
  this.SuperadminService.getSingleCustomersDetails(requestObject).subscribe((response:any) => {
    
    if(response.data == true){
      this.selectedCustomerDetails = response.response.customer;
      this.addCustomerForm.controls['firstname'].setValue(this.selectedCustomerDetails.firstname)
      this.addCustomerForm.controls['lastname'].setValue(this.selectedCustomerDetails.lastname)
      this.addCustomerForm.controls['email'].setValue(this.selectedCustomerDetails.email)
      this.addCustomerForm.controls['phone'].setValue(this.selectedCustomerDetails.phone)
      this.addCustomerForm.controls['tags'].setValue(this.selectedCustomerDetails.tags)
      this.addCustomerForm.controls['address'].setValue(this.selectedCustomerDetails.address)
      // this.customerImageUrl.setValue(this.selectedCustomerDetails.image)

    }  else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
    }
  });
}

//this is for showing a single data on page
fnSelectCustomer(selectedCustomerCode){

  this.selectedCustomerCode = selectedCustomerCode;
    
  if(!selectedCustomerCode){
    return false;
  }

  this.isLoaderAdmin = true;
  let requestObject =  {
    "unique_code": selectedCustomerCode,
  };
  this.SuperadminService.getSingleCustomersDetails(requestObject).subscribe((response:any) => {
    if(response.data == true){
      this.selectedCustomerDetails = response.response.customer;

 //     console.log(this.selectedCustomerDetails);

    }else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
    }
    this.isLoaderAdmin = false;
  });
  
}


fnUpdateCustomer(requestObject){
    this.SuperadminService.updateCustomerDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.customerDetails = response.response
       // console.log(this.customerDetails);
        this.editCustomerForm = false;
        this.ErrorService.successMessage(response.response);
        this.addFormButtonDiv = this.addFormButtonDiv ? false : true;

      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
}




  deleteCustomerDetails(){
    this.isLoaderAdmin = true;
    let requestObject={
      "unique_code": this.selectedCustomerCode,
    }
    this.SuperadminService.deleteCustomerDetails(requestObject).subscribe((response:any)=>{
      if(response.data == true){
        this.deleteCustomer = response.response
        this.ErrorService.successMessage(response.response);
        this.getAllCustomersDetails()
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);

      }
      this.isLoaderAdmin = false;
    });
  }

  ExportFile(){
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'My Awesome CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    let requestObject ={
      "boxoffice_id": this.boxofficeId,
    };
    this.SuperadminService.fnExportCustomer(requestObject).subscribe((response:any)=>{
      if(response.data == true){
        this.selectedCustomerArr = response.response
        csvExporter.generateCsv(this.selectedCustomerArr);
        this.isLoaderAdmin = false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.isLoaderAdmin = false;
      }
    });
  }
  
  eventList(){
    this.isLoaderAdmin = true;
    let requestObject = {
      "unique_code": this.selectedCustomerCode
    }
    this.isLoaderAdmin = true;
    this.SuperadminService.getSingleCustomersDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allEventListData = response.response.all
        console.log( this.allEventListData);
        // this.allEventListData.forEach(element => {
        //   element.start_date =  this.datePipe.transform(new Date(element.start_date),"EEE MMM d, y")
        // });
      }else if(response.data == false){
        this.allEventListData.length = 0;
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }

}


@Component({
  selector: 'import-file-upload',
  templateUrl: '../_dialogs/import-file-upload.html',
})

export class DialogImportFileUpload { 
  boxOfficeCode:any;
  fileToUpload:any;
  boxofficeId:any;
  isLoaderAdmin:boolean = false;
  importCustomer:any;
  
  currentUser:any;
 constructor(
  public dialogRef: MatDialogRef<DialogImportFileUpload>,
  public http: HttpClient,
  private _snackBar: MatSnackBar,
  private authenticationService : AuthenticationService,
  private ErrorService: ErrorService,
  private SuperadminService : SuperadminService,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if(localStorage.getItem('boxoffice_id')){
      this.boxofficeId = localStorage.getItem('boxoffice_id');   
    }
    
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }
  handleFileInput(files): void {
    
    this.fileToUpload = files.item(0);

    if(this.fileToUpload.type != "application/vnd.ms-excel"){
      this._snackBar.open("Please select CSV file", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
      return;
    }

  }

  fileupload(){
    alert( this.fileToUpload );
    
    if(this.fileToUpload.type != "application/vnd.ms-excel"){

      this._snackBar.open("Please select CSV file", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
      return;

    }
    
   let requestObject={
     "boxoffice_id":this.boxofficeId,
     "file":this.fileToUpload,
   }
   
   
//   this.isLoaderAdmin = true;
//   const formData: FormData = new FormData();
//   formData.append('file', this.fileToUpload);
//   formData.append('boxoffice_id',(this.boxofficeId));

//   let headers = new HttpHeaders({
//     'Content-Type': 'application/json',
//     'admin-id' : this.currentUser.user_id,
//     'api-token' : this.currentUser.token
// });
//   this.http.post(`${environment.apiUrl}/import-customers`,formData ,{headers:headers}).pipe(map((response : any) =>{
//     this.isLoaderAdmin = false;
//     if(response.data  == true){
//       this._snackBar.open("CSV file is uploaded", "X", {
//         duration: 2000,
//         verticalPosition:'top',
//         panelClass :['green-snackbar']
//       });
//       this.dialogRef.close();
//     }
//   }),catchError(this.handleError)).subscribe((res) => {
//     this.isLoaderAdmin = false;
//   });  
  
this.SuperadminService.fnImportCustomer(requestObject).subscribe((response:any)=>{
  if(response.data == true){
    this.importCustomer = response.response
    this.ErrorService.successMessage(response.response);
  }else if(response.data == false){
    this.ErrorService.errorMessage(response.response);

  }
  this.isLoaderAdmin = false;
});

}

}

@Component({
  selector: 'customer-image-upload',
  templateUrl: '../_dialogs/image-upload.html',
})
export class DialogCustomerImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogCustomerImageUpload>,
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