import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../user/auth/auth.service';
import { Subscription } from 'rxjs';
import { UserProfileService } from '../user/user-profile/user-profile.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  
  constructor( 
    private authService: AuthService, 
    private userProfileService: UserProfileService ){
  }

  // get userName(){
  //   return this.userProfileService.userName;
  // }
  
  // //testing button
  // changeUserName(){
  //   this.userProfileService.userName= "test29";
  //   // this.userProfileService.addDateTaken();
  //   this.userProfileService.userProfile.badgeCount=3;
  //   this.userProfileService.surveyCompleted();
  // }

  ngOnInit(){
    this.userSub=  this.authService.loggedInUser.subscribe(loggedInUser => {
      this.isAuthenticated = this.authService.isLoggedIn();
    });


    // if(this.userProfileService.profileIsOnDevice()){
    //   this.userProfileService.loadProfileFromDevice();
    // }
    // else{
    //   this.userProfileService.initTestProfile();
    // }

  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  // logout(){
  //   this.authService.logout();
  // }
}
