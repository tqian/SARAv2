import { Injectable } from '@angular/core';
import { UserProfile } from './user-profile.model';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  public userProfile: UserProfile;

  constructor(private http: HttpClient) { }

  saveToServer(userProfile: UserProfile){   
    const userID = 'dog';//userProfile.userID;
    const profileObj = {userID: userProfile}
    //const recipes = this.recipeServices.getRecipes();
    //console.log('pre-http call');

    this.http
      .put('https://adapts-331ee.firebaseio.com/users.json',profileObj)
      .subscribe(response =>{
        console.log(response);
      });
    // firebase.database().ref('users/'+userID).set(userProfile);

      // this.http
      // .put('https://adapts-331ee.firebaseio.com/users/v1CXgOw29MN8hHJucQeYNZgTSI42/profile.json',userProfile)
      // .subscribe(response =>{
      //   console.log(response);
      // });


  }

  retrieve(userID: string){

  }
  getProfile(){

  }
  get userName(){
    return this.userProfile.userName;
  }
  set userName(userName:string){
    this.userProfile.userName = userName;
    this.saveProfileToDevice();
  }

  initTestProfile(){
    const userProfile = new UserProfile('X1W345','testy',false,  [], 0);
    this.userProfile = userProfile;
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
    if(this.addDateTaken()){
      this.addSurveyPoints();
    }  
  }

  addDateTaken(){
    //shift hours back by 2, so that 2am, will register as 12am
    const hoursShift: number = 2;
    const currentDateTime : Date = new Date();
    currentDateTime.setHours(currentDateTime.getHours() - hoursShift);
    //now, set hours, min, sec to zero
    currentDateTime.setHours(0,0,0,0);
    const numericCurrenDateTime: number = currentDateTime.getTime();

    //check if date already exists in array of dates, otherwise add the date to datesTaken array    
    var hasMatch = false;
    for(var i=0;i<this.userProfile.datesTaken.length;i++){
        if(this.userProfile.datesTaken[i] == numericCurrenDateTime){
          hasMatch = true;
            break;
        }
    }
    if(!hasMatch){
      this.userProfile.datesTaken.push(numericCurrenDateTime);
      this.saveProfileToDevice();
      return true;  //successfully added
    }
    else{
      return false;
    }
  }



  addSurveyPoints(){
    const pointsPerSurvey = 5;
    this.addPoints(pointsPerSurvey);
  }

  addPoints(points: number){
    this.userProfile.points += points;
    this.saveProfileToDevice();
  }

//methods - to be recreated
/*
- saveProfileToDevice(userProfile: UserProfile)
- sendProfileToServer() - send from deviceStorage to server (may be only called internally 
                            - let this service worry about communicating with server)
- loadProfileFromDevice() - return userProfile
- fetchProfileFromServer -              (may be only called internally 
                            - let this service worry about communicating with server)
- addDateTaken(date: Date) - adds new date survey taken        
  - first check if 

actually, consumer of service will not know where things are stored.  It will simply get profile from service
and accept updates


after login, if nothing is on the server initialize user profile
*/


}
