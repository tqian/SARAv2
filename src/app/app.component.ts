import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './user/auth/auth.service';
import { UserProfileService } from './user/user-profile/user-profile.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private httpClient: HttpClient,
    private oneSignal: OneSignal,
    private authService: AuthService,
    private userProfileService: UserProfileService
  ) {
    this.initializeApp();
  }

  private userSub: Subscription;

  ngOnInit(){
  }

  ngOnDestroy(){
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }

  initializeApp() {
    this.authService.autoLogin();
    if(this.authService.isLoggedIn()){
      this.userSub = this.userProfileService.initializeObs().subscribe();
      // this.userProfileService.initialize();
      // if we can for things to wait to progress in here
      // then, we'll only need to load user profile here and at login in Auth component
    }


    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //link for one signal tutorial ==========> https://devdactic.com/push-notifications-ionic-onesignal/
      
      //call back for notification
      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        if (jsonData.notification.payload.additionalData != null) {
          console.log("Here we access addtional data");
          if (jsonData.notification.payload.additionalData.openURL != null) {
            console.log("Here we access the openURL sent in the notification data");

          }
        }
      };

      //this.oneSignal.startInit('YOUR ONESIGNAL APP ID', 'YOUR ANDROID ID');
      this.oneSignal.startInit(environment.oneSignalAppId, environment.firebaseConfig.messagingSenderId);

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      
      this.oneSignal.handleNotificationReceived().subscribe(data => {
       // do something when notification is received
       console.log("notification is received");
      });
      
      this.oneSignal.handleNotificationOpened().subscribe(data => {
        // do something when a notification is opened
        console.log("notification is opened");
      });
      
      this.oneSignal.endInit();

    });
  }


}
