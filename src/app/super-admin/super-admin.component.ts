import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, RouterOutlet,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {
  
  pageName :any = '';
  openEventMenuBox :boolean = false;
  currentUrl:any;
  currentUser:any;
  pageSlug:any;
  keepMe:any;
  currentUserData:any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    alert('3')
    this.keepMe = localStorage.getItem('keepMeSignIn')
        if (this.keepMe == 'true') {
          this.currentUserData = localStorage.getItem('currentUser')
        } else {
          this.currentUserData = sessionStorage.getItem('currentUser')
        }
    this.currentUser = JSON.parse(this.currentUserData);
  }

  
  ngOnInit(): void {

    
    }

    
   
}