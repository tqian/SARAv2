import { Injectable } from '@angular/core';
import { UserProfile } from './user-profile.model';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  userProfile: UserProfile;
  me = this;
  initialLoading =  new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) { }

    //returns Observable that we can subsrbie to so as to trigger an action after 
  //user profile has been initialized
  initializeObs(){
    //get profile from server
    // this.userProfile
    return this.http
      .post<any>(environment.userServer+'/userinfo',{"empty":"empty"})
      .pipe(tap(
        response =>
        {
        console.log("initializeObs response: "+  JSON.stringify(response));
        if (!response.username){
          console.log("blank or empty user_name");
          const username = localStorage.getItem('loggedInUser');
          const currenttime:Date = new Date();
          const dateString: string = moment(currenttime).format('MMMM Do YYYY, h:mm:ss a Z');
          this.userProfile = new UserProfile(username,false,[],0,0,currenttime.getTime(), dateString);
        }
        else{
          this.userProfile = response;
        }
        this.saveProfileToDevice();
        this.initialLoading.next(false);
      }
      ));
  }
 
  saveToServer(){ 
    this.loadProfileFromDevice(); 
    const userProfile: UserProfile = this.userProfile;
    // const userID = 'dog';//userProfile.userID;
    // const profileObj = {userID: userProfile}
    //const recipes = this.recipeServices.getRecipes();
    //console.log('pre-http call');

    this.http
      .post(environment.userServer+'/setuserinfo',userProfile)
      .subscribe(response =>{
        console.log(response);
      });
      console.log("saveToServer userProfile: " + JSON.stringify(userProfile));
  } 

  retrieve(userID: string){
  }
  getProfile(){
  }

  get points(){
    return this.userProfile.points;
  }

  get username(){
    return this.userProfile.username;
  }
  set username(username:string){
    this.userProfile.username = username;
    this.saveProfileToDevice();
  }

  initTestProfile(){
    const currenttime:Date = new Date();
    const dateString: string = moment(currenttime).format('MMMM Do YYYY, h:mm:ss a Z');
    const userProfile = new UserProfile('testy',false,  [], 0, 3, currenttime.getTime(), dateString);
    this.userProfile = userProfile;
    this.saveProfileToDevice();
    //STORE ON DEVICE
  }

  saveProfileToDevice(){
      localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
  }

  profileIsOnDevice(){
    if(localStorage.getItem('userProfile')!==null){
      return true;
    }
    else{
       return false;
    }
  }

  loadProfileFromDevice(){
    this.userProfile = JSON.parse(localStorage.getItem('userProfile'));
  }

  public surveyCompleted(){
    const username = localStorage.getItem('loggedInUser'); //this.authService.loggedInUser.getValue()
    // check if survey has already been take for the current day or admin is contained in the username
    if(!this.surveyTakenForCurrentDay()|| username.indexOf('admin')>=0){
      this.addDateTaken();
      this.addSurveyPoints();
      this.userProfile.lastupdate =this.numericCurrenDateTime;
      const dateString: string = moment(this.userProfile.lastupdate).format('MMMM Do YYYY, h:mm:ss a Z');
      this.userProfile.readable_ts = dateString;
      this.saveToServer();
    }
  }

  get stringCurrenDate(){
    //shift hours back by 2, so that 2am, will register as 12am
    const hoursShift: number = 2;
    const currentDateTime : Date = new Date();
    currentDateTime.setHours(currentDateTime.getHours() - hoursShift);
    //now, set hours, min, sec to zero
    currentDateTime.setHours(0,0,0,0);
    return currentDateTime.getFullYear()
            + "" + ('0' + (currentDateTime.getMonth()+1)).slice(-2) 
            + "" + ('0' + currentDateTime.getDate()).slice(-2);
 }
  
  get numericCurrenDateTime(){
     //shift hours back by 2, so that 2am, will register as 12am
     const hoursShift: number = 2;
     const currentDateTime : Date = new Date();
     currentDateTime.setHours(currentDateTime.getHours() - hoursShift);
     //now, set hours, min, sec to zero
     currentDateTime.setHours(0,0,0,0);
     return currentDateTime.getTime();
  }

  addDateTaken(){
    this.loadProfileFromDevice();
    const stringCurrenDate = this.stringCurrenDate;
    this.userProfile.datesTaken.push(stringCurrenDate);
    this.userProfile.survey_data.daily_survey[stringCurrenDate] = 1;
    this.saveProfileToDevice();
  }

  surveyTakenForCurrentDay(){
    this.loadProfileFromDevice();
    //check if date already exists in array of dates, otherwise add the date to datesTaken array    
    var hasMatch = false;
    for(var i=0;i<this.userProfile.datesTaken.length;i++){
        if(this.userProfile.datesTaken[i] == this.stringCurrenDate){
          hasMatch = true;
            break;
        }
    }
    return hasMatch;
  }

  addSurveyPoints(){
    const pointsPerSurvey = 100;
    this.addPoints(pointsPerSurvey);
  }

  addPoints(points: number){
    this.userProfile.points += points;
    this.userProfile.survey_data.points += points;
    this.saveProfileToDevice();
    this.saveToServer();
  }

  removeUserProfile(){
    localStorage.removeItem('userProfile');
  }

//methods - to be recreated
/*
x - saveProfileToDevice(userProfile: UserProfile)
- sendProfileToServer() - send from deviceStorage to server (may be only called internally 
                            - let this service worry about communicating with server)
x - loadProfileFromDevice() - return userProfile
- fetchProfileFromServer -              (may be only called internally 
                            - let this service worry about communicating with server)
x - addDateTaken(date: Date) - adds new date survey taken        
  - first check if 

x  - surveyTakenForCurrentDay
actually, consumer of service will not know where things are stored.  It will simply get profile from service
and accept updates

after login, if nothing is on the server initialize user profile
*/


}
