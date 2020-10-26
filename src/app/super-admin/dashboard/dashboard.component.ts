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

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,

  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(this.currentUser.permission != '' && this.currentUser.permission != 'A'){
      if(localStorage.getItem('permision_OV') != 'TRUE'){
        this.router.navigate(['/super-admin']);
      }
    }
    
  }

  ngOnInit(): void {

   

  }

}
