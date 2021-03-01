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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  
  ngOnInit(): void {

    
    }

    
   
}