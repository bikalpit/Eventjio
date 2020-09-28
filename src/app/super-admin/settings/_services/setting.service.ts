import { Component, Inject, Injectable, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../_services/authentication.service';



@Injectable({ providedIn: 'root' })
export class SettingService {

    // token = localStorage.getItem('token');
    // admin_id = localStorage.getItem('admin-id');
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

    private handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError('Error! something went wrong.');
    }

    ngOnInit() {
       
    }


    getAllLanguages(){
        return this.http.get(`${environment.apiUrl}/get-languages`,{}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getAllTimezone(requestObject){
        return this.http.get(`${environment.apiUrl}/get-timezone-api`,{}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    createNewBusiness(requestObject){
        return this.http.get(`${environment.apiUrl}/create-boxoffice-api`,{}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getBoxofficeDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    updateBoxoffice(requestObject){
        return this.http.post(`${environment.apiUrl}/update-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

}