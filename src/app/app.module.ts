import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { BlobModule } from 'angular-azure-blob-service';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { File } from '@ionic-native/file/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SurveyModule } from './survey/survey.module';
import { IncentiveModule } from './incentive/incentive.module';
import { LifeInsightsModule } from './incentive/life-insights/life-insights.module';
import { UserModule } from './user/user.module';
import { FormsModule } from '@angular/forms';
import { Network } from '@ionic-native/network/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    FormsModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    SurveyModule,
    IncentiveModule,
    BlobModule.forRoot(),
    LifeInsightsModule,
    UserModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    OneSignal,
    GoogleAnalytics,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
