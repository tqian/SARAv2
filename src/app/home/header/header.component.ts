import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/user/auth/auth.service';
import { Subscription } from 'rxjs';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy  {
  isAuthenticated = false;
  private userSub: Subscription;
  collapsed = true;

  constructor(private authService: AuthService, 
              private userProfileService : UserProfileService) { }
   
  
  onTestButtonClicked(){
    this.userProfileService.saveToServer();
    }

    onLogout(){
      this.authService.logout();
    }

    ngOnInit(){
      this.userSub=  this.authService.loggedInUser.subscribe(loggedInUser => {
        this.isAuthenticated = this.authService.isLoggedIn();
        // this.isAuthenticated = !!loggedInUser; //!user ? false : true;
        console.log(!loggedInUser);

      });
    }

    ngOnDestroy(){
      this.userSub.unsubscribe();
    }

    get userName(){
      return this.authService.loggedInUser.getValue();
    }
}
