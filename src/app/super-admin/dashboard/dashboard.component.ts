import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../_services/authentication.service';
import { User, Role } from './../../_models';
import { Router, RouterEvent, RouterOutlet,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentUser:any;
  pageSlug:any;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,

  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(this.currentUser.type == 'member'  && this.currentUser.permission != 'A'){
      if(localStorage.getItem('permision_OV') != 'TRUE'){
        this.router.navigate(['/super-admin']);
      }
    }
    this.router.events.subscribe(event => {
      if (event instanceof RouterEvent) this.handleRoute(event);
        const url = this.getUrl(event);
    });
    
  }

  ngOnInit(): void {

   

  }

  // page url conditions
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
    if (event && event.url) {
      this.pageSlug = event.url.split('/' , 2)
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    let devidedUrl = url.split('/',4);
    if(devidedUrl[1] == '' || devidedUrl[1] == 'boxoffice'){
      localStorage.setItem('isBoxoffice','true');
    }else{
      localStorage.setItem('isBoxoffice','false');
    }
  }

}
