//this component will register/login a user

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserProfileService } from '../user-profile/user-profile.service';

@Component({  
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private userSub: Subscription;
  private authSub: Subscription;

  constructor(private authService: AuthService, 
    private router: Router,
    private userProfileService: UserProfileService){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnInit(){
    console.log(environment.userServer);
  }

  onSubmit(form: NgForm){

    if(!form.valid){
      console.log('invalid');
      return;
    }
    const userName = form.value.userName;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if(this.isLoginMode){
      authObs =  this.authService.login(userName,password);
    }else{
      authObs =  this.authService.signup(userName, password);
    }

    this.authSub = authObs.subscribe(resData => {
      this.userSub = this.userProfileService.initializeObs()
        .subscribe(
          ()=>
          {
            this.router.navigateByUrl('/home');
            this.isLoading = false;
          }          
        );      
      console.log(resData);
    }, errorMessage=> {
      console.log(errorMessage);
      this.error = errorMessage;
      this.isLoading = false;
    });
    form.reset();
  }


  ngOnDestroy(){
    if(this.userSub){
      this.userSub.unsubscribe();
    }
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }
}
