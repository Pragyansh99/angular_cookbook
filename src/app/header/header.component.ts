import { DataStorageService } from './../shared/data-storage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub : Subscription
  isAuthenticated = false
  constructor( private dataStorageService: DataStorageService, private authService: AuthService ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe( user => {
      this.isAuthenticated = !!user;
    })
  }

  onSaveData() {
    this.dataStorageService.storeRecipe();
  }

  fetchData(){
    this.dataStorageService.fetchRecipe().subscribe();
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
