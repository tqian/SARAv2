import { Injectable } from '@angular/core';
import { UserProfile } from './user-profile.model';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  userProfile: UserProfile;
  me = this;
  initialLoading =  new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) { }



 
  initialize(){
    //get profile from server
    // this.userProfile
    this.http
      .post<any>(environment.userServer+'/userinfo',{"empty":"empty"})
      .subscribe(response =>{
        console.log("response: "+  response.userName);
        if (!response.userName){
          console.log("blank or empty user_name");
          const username = localStorage.getItem('loggedInUser');
          this.userProfile = new UserProfile("1", username,false,[],0,0);
        }
        else{
          this.userProfile = response;
        }
        this.saveProfileToDevice();
        this.initialLoading.next(false);
      });

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

  }

  retrieve(userID: string){
  }
  getProfile(){
  }

  get points(){
    return this.userProfile.points;
  }

  get userName(){
    return this.userProfile.userName;
  }
  set userName(userName:string){
    this.userProfile.userName = userName;
    this.saveProfileToDevice();
  }

  initTestProfile(){
    const userProfile = new UserProfile('X1W345','testy',false,  [], 0, 3);
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
    if(!this.surveyTakenForCurrentDay()|| username.indexOf('admin')>=0){
      this.addDateTaken();
      this.addSurveyPoints();
      this.saveToServer();
    }
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
    this.userProfile.datesTaken.push(this.numericCurrenDateTime);
    this.saveProfileToDevice();
  }

  surveyTakenForCurrentDay(){
    this.loadProfileFromDevice();
    //check if date already exists in array of dates, otherwise add the date to datesTaken array    
    var hasMatch = false;
    for(var i=0;i<this.userProfile.datesTaken.length;i++){
        if(this.userProfile.datesTaken[i] == this.numericCurrenDateTime){
          hasMatch = true;
            break;
        }
    }
    return hasMatch;
  }

  addSurveyPoints(){
    const pointsPerSurvey = 5;
    this.addPoints(pointsPerSurvey);
  }

  addPoints(points: number){
    this.userProfile.points += points;
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
