import { Component, OnInit } from '@angular/core';
import { Boot } from '../fishgame/Boot';
import { Preloader } from '../fishgame/Preloader';
import { GameSmall } from '../fishgame/GamesSmall2';
import { GameOver } from '../fishgame/GameOver';
import { Game } from '../fishgame/Game';
import { Level1 } from '../fishgame/Level1';
import { Level1Small } from '../fishgame/Level1Small';
//import { FormsModule } from '@angular/forms';
//import { PickGameService } from './pick-game.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { PreLoad } from '../../../PreLoad';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { DatabaseService } from 'src/app/monitor/database.service';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';

declare let Phaser: any;

@Component({
  selector: 'app-demo-aquarium',
  templateUrl: './demo-aquarium.component.html',
  styleUrls: ['./demo-aquarium.component.scss'],
})

//@PreLoad('survey')
export class DemoAquariumComponent implements OnInit {

  game;
  pickedGame ;
  totalPoints = 0;

  constructor(
    private db: DatabaseService,
    private alertCtrl: AlertController,
    private router: Router, 
    //private pickGameService: PickGameService,
    private ga: GoogleAnalytics,
    private route: ActivatedRoute
  ) { 
    console.log("Constructor called");
    
 /*    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.totalPoints = this.router.getCurrentNavigation().extras.state.totalPoints;
        console.log("Pass totalPoints: "+this.totalPoints);
      }
    }); */
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: "Start Survey is not avaibable!",
      message: 'Please start survey after 6pm.',
      buttons: ['OK']
    });

    await alert.present();
  }

  goToRewardsPage(){
    console.log("rewards page");
    this.router.navigate(['/home']);
  }
  

  //preload the images
  preload(){
    console.log("Preload called");
    this.game.load.image('einstein','assets/pics/ra_einstein.png');
  }

  //gets executed after preload
  create(){
    console.log(window.localStorage['TotalPoints']);
    //this.totalPoints = parseInt(window.localStorage['TotalPoints'] || "0");
    if(window.localStorage['TotalPoints'] == undefined)
        this.totalPoints = 0;
    else
        this.totalPoints = parseInt(window.localStorage['TotalPoints']);
    console.log("Inside Aquarium totalPoints: "+this.totalPoints);

    console.log("create called");
    var s = this.game.add.sprite(80,9,'einstein');
    s.rotation = 0.14;
  }

  ngOnInit() {
      
    console.log(window.localStorage['TotalPoints']);
    //this.totalPoints = parseInt(window.localStorage['TotalPoints'] || "0");
     if(window.localStorage['TotalPoints'] == undefined)
        this.totalPoints = 0;
    else
        this.totalPoints = parseInt(window.localStorage['TotalPoints']);

    console.log("Inside Aquarium totalPoints: "+this.totalPoints);
 
    this.game =  new Phaser.Game(
      window.innerWidth, 700,
      Phaser.AUTO,
      'gameDiv'
    );

    this.game.state.add('Boot', Boot);
    var preLoader = new Preloader();

    if(this.totalPoints <770 && this.totalPoints >= 0){
      preLoader.setGameName(this.pickedGame = "GameSmall");
      this.game.state.add('Preloader', preLoader);
      var gameSmall = new GameSmall();
      gameSmall.setTotalPoints(this.totalPoints);
      this.game.state.add('GameSmall', gameSmall);
    } else if ( this.totalPoints >=770 && this.totalPoints <1060 ){
      preLoader.setGameName(this.pickedGame = "Game");
      this.game.state.add('Preloader', preLoader);
      var game = new Game();
      game.setTotalPoints(this.totalPoints);
      this.game.state.add('Game', game);
    } else if( this.totalPoints >=1060 && this.totalPoints <1710 ){
      preLoader.setGameName(this.pickedGame = "Level1Small");
      this.game.state.add('Preloader', preLoader);
      var level1Small = new Level1Small();
      level1Small.setTotalPoints(this.totalPoints);
      this.game.state.add('Level1Small', level1Small);
    } else if( this.totalPoints >=1710 ){
      preLoader.setGameName(this.pickedGame = "Level1");
      this.game.state.add('Preloader', preLoader);
      var level1 = new Level1();
      level1.setTotalPoints(this.totalPoints);
      this.game.state.add('Level1', level1);
    }
    else {
      preLoader.setGameName(this.pickedGame = "GameOver");
      this.game.state.add('Preloader', preLoader);
    }
    console.log("set State!");
 
     
    this.game.state.add('GameOver', GameOver);
    this.game.state.start('Boot');
    //self = this;

    this.game.state.states[this.pickedGame].assignscope(this);

    //this.pickGameService.currentGame.subscribe(game => this.pickedGame = game)
  }

  ngAfterViewInit(){
    this.ga.trackView('Aquarium')
    .then(() => {console.log("trackView at Aquarium!")})
    .catch(e => console.log(e));

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getTracks().subscribe(tracks => {
          console.log("ngAfterViewInit db.getTracks: "+tracks);
        })
       }
    });
    
    console.log('Inside Aquarium, before addTrack');   
    this.db.getDatabaseState().subscribe(rdy => {
        if (rdy) {     
          this.db.addTrack("Aquarium", "Enter", 1); 
        }
    });        
  }  
 
  ionViewDidLeave(){
    this.game.destroy();
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack("Aquarium", "Leave", 1); 
      }
    });   
  }

  startSurvey(){

    var currentTime = moment(); 
    var startTime = moment({hour: 18});  // 6pm
    var endTime = moment({hour: 23, minute: 59});  // 11:59pm
    if(currentTime.isBetween(startTime, endTime)) {
      this.router.navigate(['survey/samplesurvey']);
      this.ga.trackEvent('Start survey Button', 'Tapped Action', 'Loading survey', 0)
      .then(() => {console.log("trackEvent for Start survey Button!")})
      .catch(e => alert("trackEvent for Start survey Button=="+e));
    } else {
      this.presentAlert();
    }
    
  }

}
