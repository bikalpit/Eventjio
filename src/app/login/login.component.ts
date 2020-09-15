import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  constructor(
    private formBuilder: FormBuilder,
  ) { 
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    this.loginForm = this.formBuilder.group({
        email: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
        password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

}
