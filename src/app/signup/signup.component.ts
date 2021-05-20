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
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  hide = true;
  adminSignUpData:any;
  termsCheckbox:boolean = true;
  termsCheckboxChecked:boolean = false;
  isLoaderAdmin:boolean = false;
  inviter : boolean = false;
  inviterEmail:any;
  inviterCode:any;
  requestObject:any;

  constructor( private formBuilder: FormBuilder,
  private http: HttpClient,
  public router: Router,
  private route: ActivatedRoute,
  private _snackBar: MatSnackBar,
  private ErrorService: ErrorService,
  private appComponent: AppComponent,
    )
     {
		if(this.route.snapshot.queryParamMap.get('email')){
			this.inviter = true;
			this.inviterEmail = this.route.snapshot.queryParamMap.get('email')
			this.inviterCode = this.route.snapshot.queryParamMap.get('inviter')
		}
		// console.log(this.route.snapshot.queryParamMap.get('email'));
		// console.log(this.route.snapshot.queryParamMap.get('inviter'));
	let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
	
	if(this.inviter){
		this.signUpForm = this.formBuilder.group({
			firstname: ['', Validators.required],      
			email:     [this.inviterEmail,[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
			password: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
			description:[''],
		});
		this.signUpForm.controls['email'].disable();
	}else{
		this.signUpForm = this.formBuilder.group({
			firstname: ['', Validators.required],    
			email:     ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
			password: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
			description:[''],
	
		});
	} 
	
   }

  	ngOnInit(): void {
  	}
  	private handleError(error: HttpErrorResponse) {
		return throwError('Error! something went wrong.');
	}

	fnChangeTermsPrivacyCheck(check){
		this.termsCheckboxChecked = check;
		this.termsCheckbox = check;
	}

  	fnSignUp(){
		if(!this.termsCheckboxChecked){
			this.termsCheckbox = false;
		}
    
		if(this.signUpForm.invalid){
		this.signUpForm.get('firstname').markAsTouched();
		this.signUpForm.get('email').markAsTouched();
		this.signUpForm.get('password').markAsTouched();
		this.signUpForm.get('description').markAsTouched();
		return false;
		}
		if(!this.termsCheckboxChecked){
			this.termsCheckbox = false;
			return false;
		}

		this.isLoaderAdmin = true;

		if(this.inviter){
			this.requestObject = {
				"firstname":this.signUpForm.get("firstname").value,
				"email":this.signUpForm.get("email").value,
				"password":this.signUpForm.get("password").value,
				"description":this.signUpForm.get("description").value,
				"inviter_id": this.inviterCode,
			};
		}else{
			
		this.requestObject = {
			"firstname":this.signUpForm.get("firstname").value,
			"email":this.signUpForm.get("email").value,
			"password":this.signUpForm.get("password").value,
			"description":this.signUpForm.get("description").value,
		};
		}
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
		});
		
		this.http.post(`${environment.apiUrl}/signup`,this.requestObject,{headers:headers} ).pipe(	
		map((res) => {
			return res;
		}),
		catchError(this.handleError)
		).subscribe((response:any) => {
			this.adminSignUpData = JSON.stringify(response.response)

			if(response.data == true){
				this._snackBar.open("Account Succesfully Created", "X", {
					duration: 2000,
					verticalPosition: 'top',
					panelClass : ['green-snackbar']
				});
				this.isLoaderAdmin = false;
				this.router.navigate(["/login"]);
			}else{
				this.ErrorService.errorMessage(response.response);
				this.isLoaderAdmin = false;
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

	  signInWithGoogle(): void {
        // localStorage.setItem('keepMeSignIn', this.keepMe)
        this.appComponent.signInWithGoogle(this.signUpForm);
    }
    signInWithFB(): void {
        // localStorage.setItem('keepMeSignIn', this.keepMe)
        this.appComponent.signInWithFB(this.signUpForm);
    }

}
