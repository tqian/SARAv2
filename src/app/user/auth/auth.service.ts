import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

export interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered? : boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
//OLD
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router) { }


  //FB APPROACH
  // user: Observable<firebase.User>;
  // constructor(private firebaseAuth: AngularFireAuth,private router: Router) {
  //   this.user = firebaseAuth.authState;
  // }

              // signup(email: string, password: string) {
              //   this.firebaseAuth
              //     .auth
              //     .createUserWithEmailAndPassword(email, password)
              //     .then(value => {
              //       console.log('Success!', value);
              //     })
              //     .catch(err => {
              //       console.log('Something went wrong:',err.message);
              //     });    
              // }
            
              // login(email: string, password: string) {
              //   this.firebaseAuth
              //     .auth
              //     .signInWithEmailAndPassword(email, password)
              //     .then(value => {
              //       console.log('Nice, it worked!');
              //       this.router.navigate(['/home']);
              //     })
              //     .catch(err => {
              //       console.log('Something went wrong:',err.message);
              //     });
              // }
            
              // logout() {
              //   this.firebaseAuth
              //     .auth
              //     .signOut();
              // }

              


  signup(email: string, password: string){
    return this.http
    .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDtiV-JpDG14wIkPsPx4v40Dgx4SQRq3Cs',
    {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError),tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  autoLogin(){
    const userData : {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    }= JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }
    const loadedUser = new User(userData.email,userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if(loadedUser.getToken()){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();

      this.autoLogout(expirationDuration);
    }
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
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

  login(email: string, password: string){
    return this.http
    .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDM8d1yG2rNPc8AotB0NoN3Q2wMq4HDooo',
    {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError),tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }


  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
    const expirationData = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationData);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }


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

}
