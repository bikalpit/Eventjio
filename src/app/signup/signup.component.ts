import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, RouterOutlet ,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  termsCheckbox:boolean = false;
  constructor(private formBuilder: FormBuilder) {
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    this.signUpForm = this.formBuilder.group({

        full_name: ['', Validators.required],        
        email:     ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
        password: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],

    });
   }

  ngOnInit(): void {
  }

  fnChangeTermsPrivacyCheck(check){
    this.termsCheckbox = check;
  }

  fnSignUp(){
    if(!this.termsCheckbox){
      return false;
    }else if(this.signUpForm.invalid){
      this.signUpForm.get('full_name').markAsTouched;
      this.signUpForm.get('email').markAsTouched;
      this.signUpForm.get('password').markAsTouched;
      return false;
    }else {
      alert("Success")
    }
  }

}
