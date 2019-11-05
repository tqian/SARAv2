
export class UserProfile {
    public userID : string;
    public userName: string;
    public isParent: boolean;
    public isActive: boolean;
    public datesTaken: number[];
    public points: number;
    //access token
    //refresh token 

    constructor(userID: string, userName: string, isParent: boolean, datesTaken: number[], points: number){        
        this.userID = userID;
        this.isParent = isParent;
        this.userName = userName;
        this.datesTaken = datesTaken;
        this.points = points;
    }
}
    