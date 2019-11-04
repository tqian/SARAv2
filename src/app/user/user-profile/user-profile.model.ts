import { int } from 'aws-sdk/clients/datapipeline';

export class UserProfile {
    public userID : string;
    public userName: string;
    public isParent: boolean;
    public isActive: boolean;
    public datesTaken: Date[];
    public points: int;
    //access token
    //refresh token 

    constructor(userID: string, userName: string, isParent: boolean, datesTaken: Date[], points: int){        
        this.userID = userID;
        this.isParent = isParent;
        this.userName = userName;
        this.datesTaken = datesTaken;
        this.points = points;
    }
}
    