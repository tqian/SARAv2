import { Component, ViewChild, OnInit } from '@angular/core';
import { DemoAquariumComponent } from '../incentive/aquarium/demo-aquarium/demo-aquarium.component';
import { Platform } from '@ionic/angular';
import { DatabaseService } from 'src/app/monitor/database.service';
import { AwsS3Service } from '../storage/aws-s3.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

//@PreLoad('aquarium')
export class HomePage implements OnInit {

  private sub1$:any;
  private sub2$:any;

  @ViewChild(DemoAquariumComponent, {static: true}) child;

  constructor(
    private platform: Platform,
    private db: DatabaseService,
    private awsS3Service: AwsS3Service) { 
    console.log("Constructor called");
    this.sub1$=this.platform.pause.subscribe(() => {        
      console.log('****UserdashboardPage PAUSED****');
      this.child.pauseGameRendering();
    });  
    this.sub2$=this.platform.resume.subscribe(() => {      
      console.log('****UserdashboardPage RESUMED****');
      this.child.resumeGameRendering();
    });
  }

  ionViewDidLeave(){
    console.log("ionDidLeave");
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack("Home", "Leave", 1); 
      }
    });   

    this.child.ionViewDidLeaveFunction();
  }

  ionViewDidEnter() {
      this.db.getDatabaseState().subscribe(rdy => {
        if (rdy) {     
          this.db.isTableEmpty().then(tableEmpty => {
            console.log("tableEmpty: "+tableEmpty);
            if(!tableEmpty) {
              this.exportDeleteDatabase();
            } else {
              this.db.addTrack("Home", "Enter", 1); 
            }
          }).catch(e => {
            console.log("In ngOnDestroy at Home:"+e);
          });
        }
    });      
    this.child.loadFunction();
  }

  ionViewWillUnload() {
    this.sub1$.unsubscribe();
    this.sub2$.unsubscribe();
  }

  ngOnInit(): void {
    //throw new Error("Method not implemented.");
  }
  
  exportDeleteDatabase(){
    console.log("exportTable!");
    this.db.exportDatabaseToJson().then((res) => {
      console.log("upload tracking: "+JSON.stringify(res));
      this.awsS3Service.upload("Tracking",res);
      this.db.dropTable();              
    });   
 
  }


}
