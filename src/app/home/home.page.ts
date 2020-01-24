import { Component } from '@angular/core';
//import { PreLoad } from '../PreLoad';
import { DatabaseService } from 'src/app/monitor/database.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AwsS3Service } from '../storage/aws-s3.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

//@PreLoad('aquarium')
export class HomePage {
  constructor(
    private ga: GoogleAnalytics,
    private db: DatabaseService,
    private awsS3Service: AwsS3Service) {          
  }

  ngAfterViewInit(){

    this.ga.trackView('Home')
    .then(() => {console.log("trackView at Home!")})
    .catch(e => console.log(e));

    
    console.log('Inside Home, ngAfterViewInit');   
    this.db.getDatabaseState().subscribe(rdy => {
        if (rdy) {     
          this.db.isTableNotEmpty().then(tableExist => {
            if(tableExist) {
              this.exportDeleteDatabase();
            } else {
              this.db.addTrack("Home", "Enter", 1); 
            }
          }).catch(e => {
            console.log("In ngAfterViewInit at Home:"+e);
          });
        }
    });      
    
  }  
 
  ionViewDidLeave(){
    console.log('Inside Home, ionViewDidLeave');   
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack("Home", "Leave", 1); 
      }
    });   
  }

  exportDeleteDatabase(){
    console.log("exportTable!");
    this.db.exportDatabaseToJson().then((res) => {
      console.log("upload tracking: "+JSON.stringify(res));
      this.awsS3Service.uploadSurveyResult("Tracking",res);
      this.db.dropTable();              
    });   

 
  }
  
}
