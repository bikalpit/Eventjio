import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import { ErrorService } from '../../../_services/error.service'
import { SettingService } from '../_services/setting.service';

@Component({
  selector: 'app-sales-tax',
  templateUrl: './sales-tax.component.html',
  styleUrls: ['./sales-tax.component.scss']
})
export class SalesTaxComponent implements OnInit {

  isLoaderAdmin:any;
  boxOfficeCode:any;
  allAddTax:any = [];
  singleTaxData:any;
  status:any;
  taxStatus:any;
  boxOfficeSalesTax:any = 'N';
  constructor(public dialog: MatDialog,
    private SettingService : SettingService,
    private ErrorService : ErrorService,) { 
      
      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
      }

      
    }

    fnBoxOfficeSalesTax(event){
      
      this.isLoaderAdmin = true;
      if(event.checked == true){
        this.boxOfficeSalesTax = 'Y'
      }else{
        this.boxOfficeSalesTax = 'N'
      }
    
    
    let requestObject = {
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "option_key"    :  "boxOfficeSalesTax",
      "option_value" : this.boxOfficeSalesTax,
      "event_id" :  null,
      'json_type' : 'Y'
    }
      this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.ErrorService.successMessage('Sales tax Updated')
        } else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      });
  
    
  }
    
    getAllAddTax(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id' : this.boxOfficeCode,
      }
     this.SettingService.getAllAddTax(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allAddTax = response.response
        console.log(this.allAddTax);
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      this.allAddTax.length = 0
      }
      this.isLoaderAdmin = false;
    })
  }

  updateTax(index){
    this.isLoaderAdmin = true;
    this.singleTaxData = this.allAddTax[index]
    this.fnAddSalesTaxDialog();
    this.isLoaderAdmin = false;

  }

  fnDeleteTax(unique_code){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code': unique_code,
    }
    this.SettingService.deleteTax(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
         this. getAllAddTax();
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;
  }

  changeTaxStaus(event,unique_code){
    this.isLoaderAdmin = true;
    if(event.checked == true){
      this.taxStatus = 'Y';
    }
    else if(event.checked == false){
      this.taxStatus = 'N';
    }
    let requestObject = {
      'unique_code': unique_code,
      'status' : this.taxStatus
    }
    this.SettingService.changeTaxStaus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
         this.getAllAddTax();
      }
      else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;
  }

  ngOnInit(): void {
    this.getAllAddTax();
  }


  fnAddSalesTaxDialog() {
    const dialogRef = this.dialog.open(AddSalesTax,{
      width: '700px',
      data:{
        boxOfficeCode:this.boxOfficeCode,
        singleTaxData:this.singleTaxData,
        // taxStatus:this.taxStatus
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.singleTaxData = null,
      this.getAllAddTax();
    });
  }

}

@Component({
  selector: 'add-sales-tax',
  templateUrl: '../_dialogs/add-sales-tax.component.html',
})
export class AddSalesTax {
  status:any;
  addTaxForm:FormGroup;
  boxOfficeCode:any;
  isLoaderAdmin:any;
  singleTaxData:any;
  taxStatus:any = 'N';

  constructor(
    private _formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AddSalesTax>,
    private http: HttpClient,
    private SettingService : SettingService,
    private ErrorService : ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode
      if(this.data.singleTaxData){
        this.singleTaxData = this.data.singleTaxData
        this.taxStatus = this.singleTaxData.status
      }
      console.log(this.singleTaxData);

      this.addTaxForm = this._formBuilder.group({
        name:['',[Validators.required]],
        value:['',[Validators.required,Validators.pattern('[0-9.]{0,1000}')]],
      })

      if(this.singleTaxData){
        this.addTaxForm.controls['name'].setValue(this.singleTaxData.name)
        this.addTaxForm.controls['value'].setValue(this.singleTaxData.value)
      }
    }

    fnchangeStatus(event){
      if(event.checked == true){
        this.taxStatus = 'Y';
      }
      else if(event.checked == false){
        this.taxStatus = 'N';
      }
    }

    fnOnSubmit(){
      if(this.addTaxForm.valid){

        if(this.singleTaxData){
          let singleTaxData = {
            "boxoffice_id" : this.boxOfficeCode,
            "unique_code": this.singleTaxData.unique_code,
            "name" : this.addTaxForm.get('name').value,
            "value" : this.addTaxForm.get('value').value,
            "status" : this.taxStatus
          }

          this.isLoaderAdmin = true;
          this.SettingService.updateTax(singleTaxData).subscribe((response:any) => {
            if(response.data == true){
             this.ErrorService.successMessage(response.response);
              this.addTaxForm.reset();
              this.dialogRef.close();
            }
            else if(response.data == false){
             this.ErrorService.errorMessage(response.response);
            }
            this.isLoaderAdmin = false;
            this.addTaxForm.reset();
          })

        }else{
          let newTaxData = {
            "boxoffice_id" : this.boxOfficeCode,
            "name" : this.addTaxForm.get('name').value,
            "value" : this.addTaxForm.get('value').value,
            "status" : this.taxStatus
          }
          this.isLoaderAdmin = true;
          this.SettingService.addTax(newTaxData).subscribe((response:any) => {
            if(response.data == true){
             this.ErrorService.successMessage(response.response);
             console.log(newTaxData);
              this.addTaxForm.reset();
              this.dialogRef.close();
            }
            else if(response.data == false){
             this.ErrorService.errorMessage(response.response);
            }
            this.isLoaderAdmin = false;
            this.addTaxForm.reset();
          })
        }

    }else{
      this.addTaxForm.get("name").markAsTouched();
      this.addTaxForm.get("value").markAsTouched();
      // this.addTaxForm.get("status").markAsTouched();
      }
    }


  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}
