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
        return this.http.post(`${environment.apiUrl}/get-languages`,{}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getAllTimezone(){
        return this.http.post(`${environment.apiUrl}/get-timezones`,{}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    createNewBusiness(requestObject){
        return this.http.post(`${environment.apiUrl}/create-boxoffice-api`,{}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getSingleBoxofficeDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getAllBoxoffice(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
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

    updateMyProfile(requestObject){
        return this.http.post(`${environment.apiUrl}/update-profile-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getMyProfileData(requestObject){
        return this.http.post(`${environment.apiUrl}/get-profile-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    updateSetting(requestObject){
        return this.http.post(`${environment.apiUrl}/set-setting-option-api
        `,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getSettingsValue(requestObject){
        return this.http.post(`${environment.apiUrl}/get-setting-option-api
        `,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getAllInviter(requestObject){
        return this.http.post(`${environment.apiUrl}/all-requested-inviter-api
        `,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    inviteform(requestObject){
        return this.http.post(`${environment.apiUrl}/request-inviter-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
   

   

    removeImage(requestObject){
        return this.http.post(`${environment.apiUrl}/remove-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    removeProfileImage(requestObject){
        return this.http.post(`${environment.apiUrl}/remove-user-image`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

   
  
    addTax(requestObject){
        return this.http.post(`${environment.apiUrl}/addsaltetax-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getAllAddTax(requestObject){
        return this.http.post(`${environment.apiUrl}/getsaltetax-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    updateTax(requestObject){
        return this.http.post(`${environment.apiUrl}/updatesaltetax-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    deleteTax(requestObject){
        return this.http.post(`${environment.apiUrl}/deletesaltetax-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getSingleTaxData(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-tax`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    changeTaxStaus(requestObject){
        return this.http.post(`${environment.apiUrl}/update-tax-status`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    fnGetAllEventList(requestObject){
        return this.http.post(`${environment.apiUrl}/get-allboxoffice-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getEventsList(requestObject){
        return this.http.post(`${environment.apiUrl}/get-events-list`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

}