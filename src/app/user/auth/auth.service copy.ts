import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

export interface AuthResponseData{
  access_token: string;
  refresh_token: string;
  access_expires: string;
  refresh_expires: string;
  registered? : boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //new
  username =  new BehaviorSubject<string>(null); 

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router) { }

  signup(userName: string, password: string){
    return this.http
    .post<AuthResponseData>(environment.userServer,
    {
      userName: userName,
      password: password
      // ,
      // returnSecureToken: true
    }).pipe(catchError(this.handleError),tap(resData => {

      const accessExpirationDate = new Date(new Date().getTime() + +resData.access_expires * 1000);
      const refreshExpirationDate = new Date(new Date().getTime() + +resData.refresh_expires * 1000);
      const user = new User(userName,resData.access_token, resData.refresh_token, accessExpirationDate,refreshExpirationDate);
      this.user.next(user);
      
      // temp - commenting out auto logout
      //this.autoLogout(+resData.accessExpiresIn * 1000);
      localStorage.setItem('user', JSON.stringify(user));      
      
      //this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  autoLogin(){
      const userData : {
      userName: string,
      _accessToken: string,
      _refreshToken: string ,
      _accessTokenExpirationDate: string,
      _refreshTokenExpirationDate: string
    }= JSON.parse(localStorage.getItem('user'));
    if(!userData){
      return;
    }
    const loadedUser = new User(userData.userName,userData._accessToken, userData._refreshToken, new Date(userData._accessTokenExpirationDate), new Date(userData._refreshTokenExpirationDate) );
    if(loadedUser.getAccessToken()){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._accessTokenExpirationDate).getTime() - new Date().getTime();
      //temp
      // this.autoLogout(expirationDuration);
    }
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/home']);
    localStorage.removeItem('user');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number){
    console.log(expirationDuration);
    this.tokenExpirationTimer= setTimeout(() => {
      this.logout();
    },expirationDuration);
  }

  login(userName: string, password: string){
    return this.http
    .post<AuthResponseData>(environment.userServer+'/login',
    {
      username: userName,
      password: password
      // ,
      // returnSecureToken: true
    }).pipe(catchError(this.handleError),tap(resData => {


      const accessExpirationDate = new Date(new Date().getTime() + +resData.access_expires * 1000);
      const refreshExpirationDate = new Date(new Date().getTime() + +resData.refresh_expires * 1000);
      const user = new User(userName,resData.access_token, resData.refresh_token, accessExpirationDate,refreshExpirationDate);
      this.user.next(user);
      
      console.log("user: " + JSON.stringify( user));
      console.log("resData: " + JSON.stringify(resData));
      // temp - commenting out auto logout
      //this.autoLogout(+resData.accessExpiresIn * 1000);
      localStorage.setItem('user', JSON.stringify(user));     

      //movign contents of below method up here. OR MAYBE NOT
      //this.handleAuthentication(userName, resData., resData.localId, resData.idToken, +resData.accessExpiresIn);
    }));
  }


  // private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
  //   const expirationData = new Date(new Date().getTime() + expiresIn * 1000);
  //   const user = new User(
  //     email,
  //     userId,
  //     token,
  //     expirationData);
  //   this.user.next(user);
  //   this.autoLogout(expiresIn * 1000);
  //   localStorage.setItem('user', JSON.stringify(user));
  // }


  private handleError(errorRes: HttpErrorResponse){
      let errorMessage = 'An unknown error occurred!';
      if(!errorRes.error || !errorRes.error.error){
        return throwError(errorMessage);
      }
      switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already!';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'Email address not found!';
          break;
        case 'INVALID_PASSWORD':
          errorMessage= 'This password is not correct.'
          break;

      }
      return throwError(errorMessage);
  }

  refreshToken() {
    const token = this.getRefreshToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<any>(`${environment.userServer}/refresh`, {
      'refreshToken': this.getRefreshToken(), httpOptions
    }).pipe(tap((
        resData: {
          "access_token": string, 
          "access_expires": string, 
          "user_name": string}) => {
      this.storeAccessToken(resData.access_token, resData.access_expires);
    }));
  }

  // getJwtToken() {
  //   return localStorage.getItem(this.JWT_TOKEN);
  // }

  // private doLoginUser(username: string, tokens: Tokens) {
  //   this.loggedUser = username;
  //   this.storeTokens(tokens);
  // }

  // private doLogoutUser() {
  //   this.loggedUser = null;
  //   this.removeTokens();
  // }

  private loadUserData(){
    const userData : {
      userName: string,
      _accessToken: string,
      _refreshToken: string ,
      _accessTokenExpirationDate: string,
      _refreshTokenExpirationDate: string
    }= JSON.parse(localStorage.getItem('user'));
    if(!userData){
      return;
    }
    this.user.next(
      new User(userData.userName,
        userData._accessToken, 
        userData._refreshToken, 
        new Date(userData._accessTokenExpirationDate), 
        new Date(userData._refreshTokenExpirationDate) 
        )
      );
  }

  private getRefreshToken():string {
    this.loadUserData();
    return localStorage.getItem(this.user.getValue().getRefreshToken());
  }

  private storeAccessToken(token: string, expires: string) {
    const user = this.user.getValue();
    const expirationDate = new Date(new Date().getTime() + +expires * 1000);
    user.setAccessToken(token, expirationDate);
    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(this.user));      
    // localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  // private storeTokens(tokens: Tokens) {
  //   localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
  //   localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  // }

  // private removeTokens() {
  //   localStorage.removeItem(this.JWT_TOKEN);
  //   localStorage.removeItem(this.REFRESH_TOKEN);
  // }

  private removeUser(){
    localStorage.removeItem('user');
  }


}
