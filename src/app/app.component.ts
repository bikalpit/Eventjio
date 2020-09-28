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
  selectedBoxOfficeName:any;
  currentUser: User;
  adminTopMenuselected:any
  currentUrl: string;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bnIdle: BnNgIdleService,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentUser.subscribe(x =>  this.currentUser = x );
    if(this.currentUser && this.currentUser !== null){
      console.log(this.currentUser)
      // alert("alert");
      this.adminTopMenuselected = this.currentUser.firstname
      
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
    if(localStorage.getItem('currentUser')){
      if(this.currentUser.user_type == 'A'){
        this.router.navigate(['/super-admin/']);
      }
      else{

      }
    }
  }

  
  dynamicSort(property: string) {
    let sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return (a, b) => {
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }

  private getUrl(event: any) {
    if (event) {
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private cleanUrl(url: string) {
    if (url) {
      let cleanUrl = url.substr(1);
      const slashIndex = cleanUrl.indexOf("/");
      console.log(slashIndex)
      if (slashIndex >= 0) {
        cleanUrl = cleanUrl.substr(slashIndex + 1, 8);
        return cleanUrl;
      } else {
        return null;
      }
    } else return null;
  }

  private urlIsNew(url: string) {
    return !!url && url.length > 0 && url !== this.currentUrl;
  }
  

  loadLocalStorage(){
    this.authenticationService.currentUser.subscribe(x =>  this.currentUser = x );
    this.adminTopMenuselected = this.currentUser.firstname
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

  fnChangeTopMenu(value){
    if(value === 'logout'){
      this.logout();
    }
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

  isBoxOfficeSelected() {
    if (localStorage.getItem('boxoffice_id') && localStorage.getItem('boxoffice_id') != "") {
      this.selectedBoxOfficeName = localStorage.getItem('boxoffice_name');
      return true;
    } else {
      return false;
    }
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
