import { Component, Inject, Injectable, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';



@Injectable({ providedIn: 'root' })
export class SuperadminService {

    token = localStorage.getItem('token');
    admin_id = localStorage.getItem('admin-id');
    globalHeaders:any;

     constructor(
        private http: HttpClient,
        public router: Router,
    ) {

        this.globalHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : localStorage.getItem('admin-id'),
            'api-token' : localStorage.getItem('token')
        });
    }  

    private handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError('Error! something went wrong.');
    }

    ngOnInit() {
       
    }
  
   
    getAllCountry(){
    
        return this.http.get(`${environment.apiUrl}/get-country-api`).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getAllCurrancy(){
        return this.http.post(`${environment.apiUrl}/get-currancy-api`,{}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }


    getAllBoxoffice(){
    
        let requestObject = {
            'admin_id' : this.admin_id,
        };

        return this.http.post(`${environment.apiUrl}/get-all-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    createNewBusiness(requestObject){
        return this.http.post(`${environment.apiUrl}/create-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
}

    