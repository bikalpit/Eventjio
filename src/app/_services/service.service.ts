import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable,throwError } from 'rxjs';
import { map,catchError, filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models/index';

@Injectable({ providedIn: 'root' })
export class ServiceService {

    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    user_id: any;
    globalHeaders:any;

    constructor(private http: HttpClient) {

        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();

        this.globalHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            // 'admin-id' : this.currentUserSubject.user_id,
            // 'api-token' : this.currentUserSubject.token
        });

    }

    

    public get currentUserValue(): User {       
        return this.currentUserSubject.value;
    }

    private handleError(error: HttpErrorResponse) {
        return throwError('Error! something went wrong.');
    }

    getSingleEvent(requestObject) {
        return this.http.post(`${environment.apiUrl}/get-single-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    getSingleBoxOffice(requestObject) {
        return this.http.post(`${environment.apiUrl}/get-single-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }

 


  

   
}