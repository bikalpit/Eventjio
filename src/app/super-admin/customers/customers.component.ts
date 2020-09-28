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

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  addCustomerForm:FormGroup;
  boxofficeId:any;
  customerDetails:any;
  singleCustomerDetails:any;
  selectedCustomerCode:any;
  selectedCustomerDetails:any;
  editCustomerForm:boolean = false;
  deleteCustomer:any;
  isLoaderAdmin:boolean = false;
  selectedCustomerArr:any;
  addFormButtonDiv : boolean = true;

  constructor(
    private formBuilder:FormBuilder,
    private SuperadminService : SuperadminService,
    public router: Router,
    private ErrorService: ErrorService,
    public dialog: MatDialog,
    private _snackBar:MatSnackBar,
  ) {
    if(localStorage.getItem('boxoffice_id')){
      this.boxofficeId = localStorage.getItem('boxoffice_id');   
    }
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    this.addCustomerForm = this.formBuilder.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      phone:['',Validators.required],
      email:['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
      image:['',Validators.required],
      address:[''],
      addTag:[''],
    });
   
    
   }


  addFormButton(){
    this.addFormButtonDiv = this.addFormButtonDiv ? false : true;
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

  submitForm(){
   
    if(this.addCustomerForm.invalid){
      this.addCustomerForm.get("firstname").markAsTouched();
      this.addCustomerForm.get("lastname").markAsTouched();
      this.addCustomerForm.get("phone").markAsTouched();
      this.addCustomerForm.get("email").markAsTouched();
      this.addCustomerForm.get("address").markAsTouched();
      this.addCustomerForm.get("addTag").markAsTouched();
      this.addCustomerForm.get("image").markAsTouched();
      return false;
    }else{
      if(this.editCustomerForm == true){

        let requestObject={
          "firstname":this.addCustomerForm.get('firstname').value,
          "lastname":this.addCustomerForm.get('lastname').value,
          "email":this.addCustomerForm.get('email').value,
          "phone":this.addCustomerForm.get('phone').value,
          "image":this.addCustomerForm.get('image').value,
          "address":this.addCustomerForm.get('address').value,
          "unique_code": this.selectedCustomerCode,
          "boxoffice_id": this.boxofficeId,
        };
        this.fnUpdateCustomer(requestObject)

      
      }else if(this.editCustomerForm == false){
      let requestObject={
        "firstname": this.addCustomerForm.get("firstname").value,
        "lastname": this.addCustomerForm.get("lastname").value,
        "phone": this.addCustomerForm.get("phone").value,
        "email": this.addCustomerForm.get("email").value,
        "address": this.addCustomerForm.get("address").value,
        "addTag": this.addCustomerForm.get("addTag").value,
        "image": this.addCustomerForm.get("image").value,
        "boxoffice_id": this.boxofficeId,
        
      }
      this.fnCreateCustomer(requestObject)
      }
 }
}

  fnCreateCustomer(requestObject){
      this.isLoaderAdmin = true;
      this.SuperadminService.createCustomersForm(requestObject).subscribe((response:any) => {
        if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.addFormButtonDiv = this.addFormButtonDiv ? false : true;
    }else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
 }
//this is for all details of customer in table
 getAllCustomersDetails(){
  this.isLoaderAdmin = true;
    let requestObject ={
      "boxoffice_id": this.boxofficeId,
    };
    // alert(this.boxofficeId);
     
    this.SuperadminService. getAllCustomersDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.customerDetails = response.response
        this.selectedCustomerCode=  this.customerDetails[0].unique_code
       this.fnSelectCustomer(this.selectedCustomerCode)
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
}

 editCustomerDetails(){
  
  this.addFormButtonDiv = this.addFormButtonDiv ? false : true;  
  this.editCustomerForm = true;
  this.isLoaderAdmin = true;
  let requestObject = {
    "unique_code": this.selectedCustomerCode,
  };
  // alert( this.selectedCustomerCode);
  this.SuperadminService. getSingleCustomersDetails(requestObject).subscribe((response:any) => {
    if(response.data == true){
      this.singleCustomerDetails = response.response[0]
      this.addCustomerForm.controls['firstname'].setValue(this.singleCustomerDetails.firstname)
      this.addCustomerForm.controls['lastname'].setValue(this.singleCustomerDetails.lastname)
      this.addCustomerForm.controls['email'].setValue(this.singleCustomerDetails.email)
      this.addCustomerForm.controls['phone'].setValue(this.singleCustomerDetails.phone)
      this.addCustomerForm.controls['addTag'].setValue(this.singleCustomerDetails.addTag)

    }
    else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
    }
    this.isLoaderAdmin = false;
  });
}

//this is for showing a single data on page
fnSelectCustomer(selectedCustomerCode){
  this.selectedCustomerCode = selectedCustomerCode;
  this.isLoaderAdmin = true;
  let requestObject ={
    "unique_code": this.selectedCustomerCode,
  };

  this.SuperadminService.getSingleCustomersDetails(requestObject).subscribe((response:any) => {
    if(response.data == true){
      this.selectedCustomerDetails = response.response
      console.log(this.selectedCustomerDetails);

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
        console.log(this.customerDetails);
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
    
    if(this.fileToUpload.type != "application/vnd.ms-excel"){

      this._snackBar.open("Please select CSV file", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
      return;

    }
  //  let requestObject={
  //    "boxoffice_id":this.boxofficeId,
  //    "file":this.fileToUpload,
  //  }
   
   
  this.isLoaderAdmin = true;
  const formData: FormData = new FormData();
  formData.append('file', this.fileToUpload);
  formData.append('boxoffice_id',this.boxofficeId);

  let Headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'admin-id' : this.currentUser.user_id,
    'api-token' : this.currentUser.token
});
  this.http.post(`${environment.apiUrl}/import-customers`,formData, {headers:Headers} ).pipe(map((response : any) =>{
    this.isLoaderAdmin = false;
    if(response.data  == true){
      this._snackBar.open("CSV file is uploaded", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['green-snackbar']
      });
      this.dialogRef.close();
    }
  }),catchError(this.handleError)).subscribe((res) => {
    this.isLoaderAdmin = false;
  });  

   
  }

}