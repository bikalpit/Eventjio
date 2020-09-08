import { Component, Inject, Injectable, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { map, catchError, filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';



@Injectable({ providedIn: 'root' })
export class SuperadminService {

    token = localStorage.getItem('token');
    admin_id = localStorage.getItem('admin-id');

  constructor(
    private http: HttpClient,
    public router: Router,
    ) {
    
  }  
    private handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError('Error! something went wrong.');
    }

    ngOnInit() {
       
    }

   
    createNewEvent(){

        let requestObject = {
            'admin_id' : '',
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : '',
            'api-token' : ''
        });
        return this.http.post(`${environment.apiUrl}/create-event-api`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    
    getAllCountry(){

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        let requestObject = {
            'admin_id' : 'aaa',
        };

        return this.http.get(`${environment.apiUrl}/get-country-api`).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getAllCurrancy(){
       
        let headers = new HttpHeaders({
            'Content-Type': 'multipart/form-data',
        });

        return this.http.post(`${environment.apiUrl}/get-currancy-api`,{},{headers:headers}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }


    getAllBoxoffice(){
       
        // let headers = new HttpHeaders({
        //     'admin-id' : this.token,
        //     'api-token' : this.admin_id
        // });

        // var data = new FormData();
        // data.append("admin_id", "usr1598962747728");
        
        // let requestObject = {
        //     'admin_id': this.admin_id
        // };

        let requestObject = {
            'admin_id' : this.admin_id,
        };

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.admin_id,
            'api-token' : this.token
        });

        return this.http.post(`${environment.apiUrl}/get-all-boxoffice-api`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    
}

    