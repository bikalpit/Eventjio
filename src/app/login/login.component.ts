import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../_services/authentication.service';


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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    //private appComponent:AppComponent,
  ) { 
    if(/msie\s|trident\//i.test(window.navigator.userAgent)){
            this.isIE = true;
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
          
            if(data.response.currentPlan == null){
                localStorage.setItem('adminData',JSON.stringify(data.response))
                localStorage.removeItem('currentUser');
                this.router.navigate(["/super-admin"]);
                return;    
            }

            if(data.response.user_type == "A"){
                this.router.navigate(["admin"]);
            }else if(data.response.user_type == "SM"){
                localStorage.setItem('internal_staff','N');
                this.router.navigate(["staff"]);
            }else{
                this.router.navigate(["user"]);
            }

            // this.appComponent.initiateTimeout();
            this.hideLoginForm = false;
            
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
