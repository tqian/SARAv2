//this component will register/login a user

import { Component, OnInit } from '@angular/core';
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
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

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
    console.log("test " );
    console.log("userName: " + userName);

    this.isLoading = true;
    if(this.isLoginMode){
      authObs =  this.authService.login(userName,password);
    }else{
      authObs =  this.authService.signup(userName, password);
    }

    authObs.subscribe(resData => {
      this.userProfileService.initialize();

      let userSub2:Subscription = this.userProfileService.initialLoading.subscribe(initialLoading =>{
        if(initialLoading ===false){
          this.isLoading = false;
          console.log("userProfile at auth: " + JSON.stringify( this.userProfileService.userProfile));
          console.log("userProfile at auth: " + this.userProfileService.userProfile.points);          // console.log("points at auth: " + this.userProfileService.userProfile.points)
          // this.router.navigate(['/']);
          this.router.navigateByUrl('/home');
        }});        

      console.log(resData);
    }, errorMessage=> {
      console.log(errorMessage);
      this.error = errorMessage;
      this.isLoading = false;
    });
    form.reset();
  }
}
