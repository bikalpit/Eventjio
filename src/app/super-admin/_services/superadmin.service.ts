import { Component, Inject, Injectable, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../_services/authentication.service';



@Injectable({ providedIn: 'root' })
export class SuperadminService {

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
  
   
    getAllCountry(){
        return this.http.post(`${environment.apiUrl}/get-country-api`,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getAllCurrancy(){
        return this.http.post(`${environment.apiUrl}/get-currancy-api`,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getAllTimeZone(){
        return this.http.post(`${environment.apiUrl}/get-timezones`,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getDefaultImages(){
        return this.http.post(`${environment.apiUrl}/get-default-images`,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getTimeSlote(requestObject){
        return this.http.post(`${environment.apiUrl}/get-timeslots`,requestObject,{headers:this.globalHeaders}).pipe(
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

    createNewBusiness(requestObject){
        return this.http.post(`${environment.apiUrl}/create-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    createNewCouponCode(requestObject){
        return this.http.post(`${environment.apiUrl}/create-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    updateCouponCode(requestObject){
        return this.http.post(`${environment.apiUrl}/update-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getAllCouponCodes(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getAllVoucherCodes(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-voucher-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    changeCouponStaus(requestObject){
        return this.http.post(`${environment.apiUrl}/update-coupon-status-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnDeleteCoupon(requestObject){
        return this.http.post(`${environment.apiUrl}/delete-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnDeleteVoucher(requestObject){
        return this.http.post(`${environment.apiUrl}/delete-voucher-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnGetSignleCouponDetail(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnGetSignleVoucherDetail(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-voucher-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    createNewEvent(requestObject){
        return this.http.post(`${environment.apiUrl}/create-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    createCustomersForm(requestObject){
        return this.http.post(`${environment.apiUrl}/create-customer-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
            }),catchError(this.handleError));
        }
         
    getAllCustomersDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-customer-api`,requestObject,{headers:this.globalHeaders}).pipe(
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

    getSingleCustomersDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-customer-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    createNewTicket(requestObject){
        return this.http.post(`${environment.apiUrl}/add-ticket`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    updateCustomerDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/update-customer-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
         }),catchError(this.handleError));
    }
    
    deleteCustomerDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/delete-customer-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res)=>{
                return res;
            }),catchError(this.handleError));
        
    }
 
   fnImportCustomer(requestObject){  
        return this.http.post(`${environment.apiUrl}/import-customers`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res)=>{
                return res;
         }),catchError(this.handleError));
   }
    
    fnExportCustomer(requestObject){
        return this.http.post(`${environment.apiUrl}/export-customers`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    createVoucherCode(requestObject){
        return this.http.post(`${environment.apiUrl}/create-voucher-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    updateVoucherCode(requestObject){
        return this.http.post(`${environment.apiUrl}/update-voucher-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnChangeEventStatus(requestObject){
        return this.http.post(`${environment.apiUrl}/update-event-status`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
}


    