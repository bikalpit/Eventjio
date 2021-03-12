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
import { ConfirmationDialogComponent } from '../../_components/confirmation-dialog/confirmation-dialog.component';
import { DatePipe} from '@angular/common';
import * as moment from 'moment'; 

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
  updateResponseMsg:any;
  selectedCustomerCode:any;
  editCustomerForm:boolean = false;
  deleteCustomer:any;
  isLoaderAdmin:boolean = false;
  selectedCustomerArr:any;
  addFormButtonDiv : boolean = true;
  customerImageUrl:any;
  allEventListData:any;
  filterEventlist:any;
  filterCustomerEvent:any = '';
  search = {
    keyword: ""
  };
  lastEventDateTime:any;
  currentUser:any;
  eventActiveTab = 'all';
  keepMe:any;
  constructor(
    private formBuilder:FormBuilder,
    private SuperadminService : SuperadminService,
    public router: Router,
    private ErrorService: ErrorService,
    public dialog: MatDialog,
    private _snackBar:MatSnackBar,
    private datePipe: DatePipe,
  ) {
    this.keepMe = localStorage.getItem('keepMeSignIn')
        if (this.keepMe == 'true') {
          this.currentUser =  JSON.parse(localStorage.getItem('currentUser'))
        } else {
          this.currentUser =  JSON.parse(sessionStorage.getItem('currentUser'))
        }
    // this.currentUser = JSON.parse(this.currentUser);

    if(this.currentUser.type == 'member' && this.currentUser.permission != 'A'){
      this.router.navigate(['/super-admin']);
    }

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
    this.editCustomerForm =false; 
    
  }

  customerSearch(){
    this. getAllCustomersDetails();
  }
  
  ngOnInit(): void {
    this.getAllCustomersDetails();
    this. fngetCustomersEventlist();
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
    this.isLoaderAdmin = true;
    this.SuperadminService.createCustomersForm(requestObject).subscribe((response:any) => {
    if(response.data == true){
      this.ErrorService.successMessage(response.response);
      this.addCustomerForm.reset();
      this.customerImageUrl = null;
      this.getAllCustomersDetails();
      this.addFormButtonDiv = this.addFormButtonDiv ? false : true;
    }else if(response.data == false){
      this.ErrorService.errorMessage(response.response);     
      }
    this.isLoaderAdmin = false;
    });
 }

 
 getAllCustomersDetails(){
    
    this.isLoaderAdmin = true;
    
    let requestObject ={
      'search':this.search.keyword,
      "boxoffice_id": this.boxofficeId,
      "event_id":this.filterCustomerEvent,
    };
     
    this.SuperadminService.getAllCustomersDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.customerDetails = response.response;
        this.selectedCustomerCode =  this.customerDetails[0].unique_code
        this.fnSelectCustomer(this.selectedCustomerCode)
      }else if(response.data == false){
        // this.ErrorService.errorMessage(response.response);
        this.customerDetails = null;
        this.addFormButtonDiv = false;
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
      this.selectedCustomerDetails = null;
      this.ErrorService.errorMessage(response.response);
    }
  this.isLoaderAdmin = false;
  });
}

fnSelectCustomer(selectedCustomerCode){

  this.isLoaderAdmin = true;
  this.selectedCustomerCode = selectedCustomerCode;
    
  if(!selectedCustomerCode){
    return false;
  }

  let requestObject =  {
    "unique_code": selectedCustomerCode,
  };
  this.SuperadminService.getSingleCustomersDetails(requestObject).subscribe((response:any) => {
    if(response.data == true){
      this.selectedCustomerDetails = response.response.customer;
      this.allEventListData = response.response
      if(this.allEventListData.lastOrder){

      this.lastEventDateTime = moment(this.allEventListData.lastOrder.start_date +' '+this.allEventListData.lastOrder.start_time).format('d MMM y, hh:mm a');
      }
      // this.lastEventDateTime = this.datePipe.transform(new Date(this.allEventListData.lastOrder.start_date), 'MMM d, y')+', '+this.datePipe.transform(new Date(this.allEventListData.lastOrder.start_time), 'h:mm:ss a')
      this.addFormButtonDiv = true;
    }else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
    }
    this.isLoaderAdmin = false;
  });
  
}


fnUpdateCustomer(requestObject){
  this.isLoaderAdmin = true;
    this.SuperadminService.updateCustomerDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.updateResponseMsg = JSON.stringify(response.response)
        this.editCustomerForm = false;
        this.ErrorService.successMessage(this.updateResponseMsg);
        this.addCustomerForm.reset();
        this.customerImageUrl = null;
        this.fnSelectCustomer(this.selectedCustomerCode);
        this.addFormButtonDiv = this.addFormButtonDiv ? false : true;

      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
}


deleteCustomerDetails(){
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '400px',
    data: "Are you sure?"
  });
  dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.fnDeleteCustomer();
      }
  });
}


  fnDeleteCustomer(){
    this.isLoaderAdmin = true;
    let requestObject={
      "unique_code": this.selectedCustomerCode,
    }
    this.SuperadminService.deleteCustomerDetails(requestObject).subscribe((response:any)=>{
      if(response.data == true){
        // this.deleteCustomer = response.response
        this.ErrorService.successMessage(response.response);
        this.getAllCustomersDetails();
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
    this.isLoaderAdmin = true;
    let requestObject ={
      "boxoffice_id": this.boxofficeId,
    };
    this.SuperadminService.fnExportCustomer(requestObject).subscribe((response:any)=>{
      if(response.data == true){
        this.selectedCustomerArr = response.response
        csvExporter.generateCsv(this.selectedCustomerArr);
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
        this.isLoaderAdmin = false;
    });
  }
  
  
  eventList(selectedTab){

    this.eventActiveTab = selectedTab;

    this.isLoaderAdmin = true;
    let requestObject = {
      "unique_code": this.selectedCustomerCode
    }
    this.SuperadminService.getSingleCustomersDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allEventListData = response.response
      
      }else if(response.data == false){
        this.allEventListData.length = 0;
        // this.ErrorService.errorMessage(response.response);
      }
    this.isLoaderAdmin = false;
    });
  }

  fnFilterCustomer(event){
    this.filterCustomerEvent = event.value
    this.getAllCustomersDetails();
  }

  fngetCustomersEventlist(){
    this.isLoaderAdmin = true;
    let requestObject ={
      "boxoffice_id":this.boxofficeId,
    }
    this.SuperadminService. fngetCustomersEventlist(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this.filterEventlist = response.response
        console.log(this.filterEventlist);
      }
    this.isLoaderAdmin = false;
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
    
    const formData =  new FormData();
    formData.append('file', this.fileToUpload);
    formData.append('boxoffice_id',(this.boxofficeId));

    this.isLoaderAdmin = true;
    this.SuperadminService.fnImportCustomer(formData).subscribe((response:any)=>{
      if(response.data == true){
        this.importCustomer = response.response
        this.ErrorService.successMessage(response.response);
        this.dialogRef.close();
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);

      }
      this.isLoaderAdmin = false;
    });


  //  let requestObject={
  //    "boxoffice_id":this.boxofficeId,
  //    "file":this.fileToUpload,
  //  }
   
   
  // this.isLoaderAdmin = true;
  // const formData: FormData = new FormData();
  // formData.append('file', this.fileToUpload);
  // formData.append('boxoffice_id',(this.boxofficeId));

  // let headers = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   'admin-id' : this.currentUser.user_id,
  //   'api-token' : this.currentUser.token
  // });

  // this.http.post(`${environment.apiUrl}/import-customers`,formData ,{}).pipe(map((response : any) =>{
  //   this.isLoaderAdmin = false;
  //   if(response.data  == true){
  //     this._snackBar.open("CSV file is uploaded", "X", {
  //       duration: 2000,
  //       verticalPosition:'top',
  //       panelClass :['green-snackbar']
  //     });
  //     this.dialogRef.close();
  //   }
  // }),catchError(this.handleError)).subscribe((res) => {
  //   this.isLoaderAdmin = false;
  // });  
  

    
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
  private _snackBar:MatSnackBar,
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
    if(event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/png' || event.target.files[0].type == 'image/jpg'){
      console.log(event.target.files)
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadForm.patchValue({
              fileSource: reader.result
          });
      };
    }else{
      this._snackBar.open('Only JPEG, JPG, PNG files is allowed.', "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      event.target.files = undefined
      return false
    }
    
  }
}
uploadImage() {
  this.profileImage = this.imageSrc
  this.imageSrc= null;
  this.dialogRef.close(this.profileImage);
}


}