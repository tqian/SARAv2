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
    private userProfileService: UserProfileService){

  }

  ngOnInit(){
    this.userSub=  this.authService.loggedInUser.subscribe(loggedInUser => {
      this.isAuthenticated = this.authService.isLoggedIn();
      if(this.isAuthenticated){
        this.userProfileService.initialize();
      }
    });

  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

}
