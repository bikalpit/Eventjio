import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, RouterOutlet ,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { ErrorService } from '../_services/error.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  hide = true;
  adminSignUpData:any;
  termsCheckbox:boolean = false;
  isLoaderAdmin:boolean = false;


  constructor( private formBuilder: FormBuilder,
  private http: HttpClient,
  public router: Router,
  private route: ActivatedRoute,
  private _snackBar: MatSnackBar,
  private ErrorService: ErrorService,
    )
     {
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    this.signUpForm = this.formBuilder.group({

        firstname: ['', Validators.required],        
        // email:     ['',[Validators.required,Validators.email,Validators.pattern(emailPattern),this.isEmailUnique.bind(this)]],
        email:     ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
        password: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
        description:[''],
        termsCheckbox:[''],

    });
   }

  ngOnInit(): void {
  }
  private handleError(error: HttpErrorResponse) {
		return throwError('Error! something went wrong.');
		//return error.error ? error.error : error.statusText;
	  }

  fnChangeTermsPrivacyCheck(check){
    this.termsCheckbox = check;
  }

  fnSignUp(){
    if(!this.termsCheckbox){
      return false;
    }
    
    if(this.signUpForm.invalid){
      this.signUpForm.get('firstname').markAsTouched();
      this.signUpForm.get('email').markAsTouched();
      this.signUpForm.get('password').markAsTouched();
      this.signUpForm.get('description').markAsTouched();
      return false;
    }
	this.isLoaderAdmin = true;
      let requestObject = {
				"firstname":this.signUpForm.get("firstname").value,
				"email":this.signUpForm.get("email").value,
                "password":this.signUpForm.get("password").value,
                "description":this.signUpForm.get("description").value
			};
			let headers = new HttpHeaders({
				'Content-Type': 'application/json',
			});
			
		  this.http.post(`${environment.apiUrl}/signup`,requestObject,{headers:headers} ).pipe(	
			map((res) => {
			  return res;
			}),
			catchError(this.handleError)
			).subscribe((response:any) => {
				this.adminSignUpData = JSON.stringify(response.response)

				localStorage.setItem('adminData',this.adminSignUpData)
			  if(response.data == true){
				this._snackBar.open("Account Succesfully Created", "X", {
					duration: 2000,
					verticalPosition: 'top',
					panelClass : ['green-snackbar']
				});
					
					this.router.navigate(["/login"]);
			  }else{
				this.ErrorService.errorMessage(response.response);
				this._snackBar.open(response.response, "X", {
					duration: 2000,
					verticalPosition: 'top',
					panelClass : ['red-snackbar']
					});
			  }
			 
			},
			(err) =>{
			  console.log(err)
			})


    
  }
  isEmailUnique(control: FormControl) {
		return new Promise((resolve, reject) => {
		  setTimeout(() => {
			let headers = new HttpHeaders({
			  'Content-Type': 'application/json',
			});
			return this.http.post(`${environment.apiUrl}/verify-email`,{ emailid: control.value },{headers:headers}).pipe(map((response : any) =>{
			  return response;
			}),
			catchError(this.handleError)).subscribe((res) => {
			  if(res){
				if(res.data == false){
				resolve({ isEmailUnique: true });
				}else{
				resolve(null);
				}
			  }
			});
		  }, 500);
		});
	  }

}
