import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../user/auth/auth.service';
import { Subscription } from 'rxjs';
import { UserProfile } from '../user/user-profile/user-profile.model';
import { UserProfileService } from '../user/user-profile/user-profile.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;


  email: string;
  // userName: string;// = "test";

  
  constructor( 
    private authService: AuthService, 
    private userProfileService: UserProfileService ){
  }

  get userName(){
    return this.userProfileService.userName;
  }
  
  changeUserName(){
    this.userProfileService.userName= "test29";
    // this.userProfileService.addDateTaken();
    this.userProfileService.userProfile.badgeCount=3;
    this.userProfileService.surveyCompleted();
  }

  // get points(){
  //   return this.userProfileService.points()
  // }

  ngOnInit(){
    this.userSub=  this.authService.loggedInUser.subscribe(loggedInUser => {
      this.isAuthenticated = this.authService.isLoggedIn();

      // this.isAuthenticated = !!this.authService.isLoggedIn();
    });

    // this.userSub=  this.authService.user.subscribe(user => {
    //   this.isAuthenticated = !!user; //!user ? false : true;
    //   console.log(!user);
    // });

    this.authService.autoLogin();

    if(this.userProfileService.profileIsOnDevice()){
      this.userProfileService.loadProfileFromDevice();
    }
    else{
      this.userProfileService.initTestProfile();
    }

    // this.userSub=  this.authService.user.subscribe(user => {
    //   this.isAuthenticated = !!user; //!user ? false : true;
    //   console.log('no user: ' + !user);
    // });


    // const userData : {
    //   email: string,
    //   id: string,
    //   _token: string,
    //   _tokenExpirationDate: string
    // }= JSON.parse(localStorage.getItem('userData'));

    // console.log(userData);
    // this.email = userData.email;

    // console.log(this.authService.user.getValue());
    // const userProfile: UserProfile =  new UserProfile(userData.id, userData.email, false, null,0);  
  }

  ngOnDestroy(){
    // this.userSub.unsubscribe();
  }

  logout(){
    this.authService.logout();
  }
}
