import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../_services/authentication.service';
import { AppComponent } from '../app.component';
import { User, Role } from '../_models';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  hide = true;
  hideLoginForm: boolean = true;
  dataLoaded: boolean = false;
  isIE: boolean = false;
  currentUser: User;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private appComponent:AppComponent,
    //private appComponent:AppComponent,
  ) { 
    if(/msie\s|trident\//i.test(window.navigator.userAgent)){
        this.isIE = true;
    }
    // redirect to home if already logged in
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
       
    if (this.authenticationService.currentUserValue) {
        this.appComponent.fnCheckLoginStatus();
    }
  };

  ngOnInit(): void {
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    this.loginForm = this.formBuilder.group({
        email: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
        password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if(this.loginForm.invalid){
        this.loginForm.get('email').markAsTouched();
        this.loginForm.get('password').markAsTouched();

        return false;
    }
    this.authenticationService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
    .pipe(first()).subscribe(data => {

        if(data.data == true){
            localStorage.setItem('currentUser',JSON.stringify(data.response))
            this.router.navigate(["/super-admin"]);
            
        }else if(data.data == false){

            this._snackBar.open(data.response, "X", {
                duration: 2000,
                verticalPosition:'top',
                panelClass :['red-snackbar']
                });
            this.error = data.response; 
            this.dataLoaded = true;

        }  else{
            this.error = "Database Connection Error."; 
            this.dataLoaded = true;
        }

    },
    error => {  
        this.error = "Database Connection Error."; 
        this.dataLoaded = true;  
    });
}
}
