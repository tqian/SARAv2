import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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

  // rerender = false;
  showComponent:boolean = false;

  constructor( 
    private authService: AuthService, 
    private userProfileService: UserProfileService,
    private cdRef:ChangeDetectorRef){
  }
  render(){
    return  this.isAuthenticated && this.showComponent;
    // return  this.showComponent;
  }


  ngOnInit(){
    // we're waiting to make the component visible until User Profile has loaded

    // may not be necessary, since we're initializing user profile at login and after autoLogin
    // this doesn't seem to work, need to wait until loggedIn
    // this.userSub = this.userProfileService.initializeObs().subscribe( 
    //   () => {
    //     this.showComponent=true
    //   }
    // );

    this.userSub=  this.authService.loggedInUser.subscribe(loggedInUser => {
      this.isAuthenticated = this.authService.isLoggedIn();
      if(this.isAuthenticated){
        this.userSub = this.userProfileService.initializeObs().subscribe( 
          () => {
            this.showComponent=true
          }
        );
      }
    });

  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

}
