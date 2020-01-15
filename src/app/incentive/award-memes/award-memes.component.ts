import { Component, OnInit } from '@angular/core';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { DatabaseService } from 'src/app/monitor/database.service';

@Component({
  selector: 'app-award-memes',
  templateUrl: './award-memes.component.html',
  styleUrls: ['./award-memes.component.scss'],
})
export class AwardMemesComponent implements OnInit {

  whichImage: string;
  //src="{{whichImage}}"
  constructor(
    private ga: GoogleAnalytics,
    private db: DatabaseService) { }

  ngOnInit() {
    this.ga.trackView('Life-insight')
    .then(() => {console.log("trackView at Life-insight!")})
    .catch(e => console.log(e));

    var randomInt = Math.floor(Math.random() * 5) + 1;
    this.whichImage = "./assets/memes/"+randomInt+".jpg";
  }

  ngAfterViewInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack("Award-Memes Page", "Enter", 1);
      }
    });     
 }     


  ionViewDidLeave(){
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack("Award-Memes Page", "Leave", 1); 
      }
    });   
  }

}
