import { Component } from '@angular/core';
import { Router, RouterEvent, RouterOutlet,ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { User, Role } from './_models';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Eventjio';
  boxofficeComponent:boolean = false;
  pageName :any = 'Dashboard';
  timer: any = 0;
  
  currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bnIdle: BnNgIdleService,
    private authenticationService: AuthenticationService,
  ) {
    if(this.authenticationService.currentUser){
      this.loadLocalStorage();
    }
    this.bnIdle.startWatching(6600).subscribe((res) => {
      if(res) {
        if(this.authenticationService.currentUserValue){
            this.logout();
        }
      }
    })
  }

  ngOnInit() {

    var is_logout = this.authenticationService.logoutTime();
    if(is_logout==true){
        this.router.navigate(['/login']);
        return false;
    } 
    if(localStorage.getItem('currentUser') && localStorage.getItem('isBusiness') && localStorage.getItem('isBusiness') == "true"){
    }  
  }

  loadLocalStorage(){
    this.authenticationService.currentUser.subscribe(x =>  this.currentUser = x );
  }

  logout() {
 
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  fnCheckLoginStatus(){
    
    
    if(!this.authenticationService.currentUserValue.google_id && !this.authenticationService.currentUserValue.facebook_id){
      if(this.authenticationService.currentUserValue.user_type == Role.Admin){
          this.router.navigate(["admin"]);
      }else if(this.authenticationService.currentUserValue.user_type == Role.Staff){
          this.router.navigate(["staff"]);
      }else if(Role.Customer){
          this.router.navigate(["user"]);
      }
    }
  }
  

  initiateTimeout() {
    let that = this
    that.timer = setTimeout(function () {
      that.logout();
    }, 1080000);
  }

  

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

  isAdminUser() {
    return this.currentUser && this.currentUser.user_type === Role.Admin;
  }
  isLogin() {
    if (localStorage.getItem('currentUser')) {
      return true;
     
    } else {
      return false;
    }
  }

}
