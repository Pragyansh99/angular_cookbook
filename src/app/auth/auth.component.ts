import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error : string = null

    constructor(private authService : AuthService) { }

    switchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit(form: NgForm) {
        if(!form.valid) { return; }

        let authObs: Observable<AuthResponseData>;

        this.isLoading = true
        if(this.isLoginMode) {
            authObs = this.authService.login(form.value.email, form.value.password)
        } else {
            authObs = this.authService.signup(form.value.email, form.value.password)   
        }

        authObs.subscribe(response => {
            this.isLoading = false
            this.error = null
        }, errorMessage => {
            this.isLoading = false;
            this.error = errorMessage;
        })

        form.reset();
    }

}