import { Injectable } from '@angular/core';
import { UserProfile } from './user-profile.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) { }

  saveToServer(userProfile: UserProfile){   
    const userID = 'dog';//userProfile.userID;
    //const recipes = this.recipeServices.getRecipes();
    //console.log('pre-http call');
    this.http
      .put('https://adapts-331ee.firebaseio.com/users.json',{userID:userProfile})
      .subscribe(response =>{
        console.log(response);
      });
  }

  retrieve(userID: string){

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

actually, consumer of service will not know where things are stored.  It will simply get profile from service
and accept updates


after login, if nothing is on the server initialize user profile
*/


}
