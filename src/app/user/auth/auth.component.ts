//this component will register/login a user

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { environment } from 'src/environments/environment';


@Component({  
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router){}

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
      console.log(resData);
      this.isLoading = false;
      this.router.navigate(['/home']);
    }, errorMessage=> {
      console.log(errorMessage);
      this.error = errorMessage;
      this.isLoading = false;
    });
    form.reset();
  }
}
