import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models/index';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    user_id: any;
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        console.log(this.currentUser)
    }

    public getIPAddress()  
    {  
      return this.http.get("http://api.ipify.org/?format=json");  
    }  

    public get currentUserValue(): User {       
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { email, password })
        .pipe(map(user => {
            if (user && user.data== true && user.response.token) {
                localStorage.setItem('currentUser', JSON.stringify(user.response));
                this.currentUserSubject.next(user.response);
            }
            return user;
        }));
    }


    signup(signUpUserObj) {
        return this.http.post<any>(`${environment.apiUrl}/signup`,signUpUserObj)
        .pipe(map(data => {
            return data;
        }));
    }

    sendResetLink(user_email: string){
         let site_url = environment.urlForLink;
         return this.http.post<any>(`${environment.apiUrl}/ForgotPasswordProcess/send_reset_link`, { user_email, site_url })
            .pipe(map(data => { 
                return data;
            }));

    }

    setNewPassword(npassword: string, user_id: string){
        return this.http.post<any>(`${environment.apiUrl}/ForgotPasswordProcess/set_reset_password`, { npassword, user_id })
            .pipe(map(data => {                                              
                return data;
            }));

    }

    logout() {

        localStorage.removeItem('currentUser');
        localStorage.removeItem('isFront');
        localStorage.removeItem('logoutTime');
        localStorage.removeItem('isBoxoffice');
        localStorage.removeItem('adminData');
        this.currentUserSubject.next(null);
    }

    pageName(name,user_type){
        
    }

    logoutTime(){
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(currentUser){
            var logoutTime = JSON.parse(localStorage.getItem('logoutTime'));
            logoutTime = new Date(logoutTime);
            var currentTime = new Date();
            if(currentTime>logoutTime && localStorage.getItem('logoutTime')){
                this.logout();
                return true;
            }else{
                return false;
            }
        }
    }
}