import { Component } from '@angular/core';
import { Router, RouterEvent, RouterOutlet,ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { AuthenticationService } from './_services/authentication.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Eventjio';
  boxofficeComponent:boolean = false;
  pageName :any = 'Dashboard';

  constructor(
    public auth:AuthenticationService,
    public router:Router
  ) {}

  isBoxoffice() {

    if (localStorage.getItem('isBoxoffice') && localStorage.getItem('isBoxoffice') == "true") {
      this.boxofficeComponent = true;
      return true;
    } else {
      this.boxofficeComponent = false;
      return false;
    }

  }

  fnPostUrl(postUrl){
    this.pageName = postUrl; 
  }

  logOut(){
    this.auth.logout();
    this.router.navigate(['/login'])
  }
}
