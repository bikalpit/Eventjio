import { Component, Inject, Injectable, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../_services/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class SingleEventServiceService {
  globalHeaders:any;
  currentUser:any;

  constructor(
    private http: HttpClient,
        public router: Router,
        private authenticationService : AuthenticationService,
  ) { 
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.globalHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'admin-id' : this.currentUser.user_id,
        'api-token' : this.currentUser.token
    });
  }
}
