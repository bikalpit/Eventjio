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
  currentUrl: string = '';
  openLogoutMenuBox :boolean = false;
  pageSlug:any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bnIdle: BnNgIdleService,
    private authenticationService: AuthenticationService,
  ) {

    this.authenticationService.currentUser.subscribe(x =>  this.currentUser = x );
    this.router.events.subscribe(event => {
      if (event instanceof RouterEvent) this.handleRoute(event);
        const url = this.getUrl(event);
        this.currentUrl = url;
      if(localStorage.getItem('currentUser') && this.currentUrl == ''){
        if(this.currentUser.user_type == 'A' ){
          this.router.navigate(['/super-admin/']);
        }

      }
    });
    
    if(this.currentUser && this.currentUser !== null){
      this.adminTopMenuselected = this.currentUser.firstname
      this.loadLocalStorage();
    }

    this.bnIdle.startWatching(6600).subscribe((res) => {
      if(res) {
        if(this.authenticationService.currentUserValue){
            this.logout();
        }
      }
    });

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
      this.pageSlug = event.url.split('/' , 2)
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

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    this.currentUrl = url;
    if(url === '/super-admin/dashboard' ){
      this.pageName = 'Dashboard';
    }
    else if(url === '/super-admin/events'){
      this.pageName= 'Events'
    }
    else if(url === '/super-admin/orders'){
      this.pageName= 'Orders'
    }
    else if(url === '/super-admin/customers'){
      this.pageName= 'Customers'
    }
    else if(url === '/super-admin/coupons'){
      this.pageName= 'Coupon'
    }
    else if(url === '/super-admin/settings'){
      this.pageName= 'Settings'
    }
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
          this.router.navigate(["super-admin"]);
      }
    }
  }

  openLogoutMenu(){
    this.openLogoutMenuBox = this.openLogoutMenuBox?false :true;
  }

  onClickedOutside(){
    this.openLogoutMenuBox = false;
  }
  

  initiateTimeout() {
    let that = this
    that.timer = setTimeout(function () {
      that.logout();
    }, 1080000);
  }

  fnLogout(){
      this.logout();
      this.openLogoutMenuBox = false;
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
    return this.currentUser && (this.currentUser.user_type === Role.Admin);
  }
  
  isLogin() {
    if (localStorage.getItem('currentUser')) {
      return true;
     
    } else {
      return false;
    }
  }
  
  isPermisionPage(pageName){

    var loginUser = JSON.parse(localStorage.getItem('currentUser'));


    if(!loginUser){
      return false;
    }
  
    if(loginUser.type == 'member' && loginUser.permission !="A"){

      if(pageName=='Dashboard' &&  localStorage.getItem('permision_OV')){
        return true;
      }

      if(pageName=='Events' &&  localStorage.getItem('permision_EM')){
        return true;
      }

      if(pageName=='Orders' &&  localStorage.getItem('permision_OM')){
        return true;
      }

    }else if(loginUser.type == 'member' && loginUser.permission == "A"){
      return true;
    }else if(loginUser.type == 'admin' ){
      return true;
    }

  }

 
}
