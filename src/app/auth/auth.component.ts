import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder.directive";

import { AuthService, AuthResponseData } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error : string = null
    @ViewChild(PlaceholderDirective) alertHost : PlaceholderDirective;

    private closeSub :Subscription

    constructor(private authService : AuthService, private componentFactoryResolver: ComponentFactoryResolver) { }

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
            // this.error = errorMessage;
            this.showError(errorMessage)
        })

        form.reset();
    }

    onHandelError(){
        this.error = null
    }

    private showError(errorMessage) {
        const alertFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
        const hostViewContainerRef  = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertFactory);
        componentRef.instance.message = errorMessage
        this.closeSub = componentRef.instance.close.subscribe(()=>{
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
       if(this.closeSub) {
        this.closeSub.unsubscribe();
       } 
    }

}