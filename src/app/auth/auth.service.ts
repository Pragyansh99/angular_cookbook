import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs'
import { Router } from '@angular/router';

import { User } from './user.model';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?:boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    
    API_KEY = 'AIzaSyAcZgH17LFmuRl3ynbIN4dIpqVuYzz9xkU';
    user  = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient, private router: Router) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handelError), tap(resData => {
                this.handleAuthSuccess(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            }))
    }

    login(email:string,password:string) {
        return this.http.post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handelError),
            tap(resData => {
                this.handleAuthSuccess(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            }))
    }

    autoLogin() { 
        const user = JSON.parse(localStorage.getItem('userData'))
        if(!user) {
            return;
        }

        const loadedUser = new User(user.email, user.id, user._token, new Date(user._tokenExpirationDate))

        if(!loadedUser.token) {
            this.user.next(loadedUser);
        }

    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
    }

    private handleAuthSuccess(email:string, userId:string, token:string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000 )
        const user = new User(email, userId, token, expirationDate) 
        this.user.next(user);
        localStorage.setItem('userData',JSON.stringify(user))
        this.router.navigate(['/recipes'])
    }

    private handelError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An Error Occured'
        if (!errorRes.error || !errorRes.error.error) { return throwError(errorMessage) }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'Email already in use!';
                break;
            case 'EMAIL_NOT_FOUND': 
                errorMessage = 'Email not registered!';
                break;
            case 'INVALID_PASSWORD': 
                errorMessage = 'Invalid Credentials!';
                break;
        }
        return throwError(errorMessage)
    }
}