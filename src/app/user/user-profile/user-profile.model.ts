// import { Injectable } from '@angular/core';

// @Injectable({
//     providedIn: 'root'
//   })
export class UserProfile {
    public userID : string;
    public userName: string;
    public isParent: boolean;
    public isActive: boolean;
    public datesTaken: number[];
    public points: number;
    public badgeCount: number;
    //access token
    //refresh token 

    constructor(userID: string, 
                userName: string, 
                isParent: boolean, 
                datesTaken: number[], 
                points: number,
                badgeCount: number){        
        this.userID = userID;
        this.isParent = isParent;
        this.userName = userName;
        this.datesTaken = datesTaken;
        this.points = points;
        this.badgeCount = badgeCount;

    }
}
    