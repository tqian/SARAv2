import { Component, OnInit } from '@angular/core';
import { Boot } from '../fishgame/Boot';
import { Preloader } from '../fishgame/Preloader';
import { GameSmall } from '../fishgame/GamesSmall2';
import { GameOver } from '../fishgame/GameOver';
import { Game } from '../fishgame/Game';
import { Level1 } from '../fishgame/Level1';
import { Level1Small } from '../fishgame/Level1Small';
import { FormsModule } from '@angular/forms';
//import { PickGameService } from './pick-game.service';
import { ActivatedRoute, Router } from '@angular/router';

declare let Phaser: any;

@Component({
  selector: 'app-demo-aquarium',
  templateUrl: './demo-aquarium.component.html',
  styleUrls: ['./demo-aquarium.component.scss'],
})
export class DemoAquariumComponent implements OnInit {

  game;
  pickedGame;

  constructor(private router: Router, 
    //private pickGameService: PickGameService,
    private route: ActivatedRoute) { 
    console.log("Constructor called");
    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.pickedGame = this.router.getCurrentNavigation().extras.state.game;
        console.log("Inside condition");
      }
    });
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
    console.log("create called");
    var s = this.game.add.sprite(80,9,'einstein');
    s.rotation = 0.14;
  }

  ngOnInit() {
    console.log("ngOnInit: "+this.pickedGame);
    this.game =  new Phaser.Game(
      window.innerWidth, 700,
      Phaser.AUTO,
      'gameDiv'
    );

    this.game.state.add('Boot', Boot);
    var preLoader = new Preloader();
    preLoader.setGameName(this.pickedGame);
    this.game.state.add('Preloader', preLoader);
    if(this.pickedGame == 'Game') {
      this.game.state.add('Game', Game);
    } else if(this.pickedGame == 'GameSmall')
    {
      this.game.state.add('GameSmall', GameSmall);
    }
    else if(this.pickedGame == 'Level1')
    {
      this.game.state.add('Level1', Level1);
    }
    else if(this.pickedGame == 'Level1Small')
    {
      this.game.state.add('Level1Small', Level1Small);
    }
    this.game.state.add('GameOver', GameOver);
    this.game.state.start('Boot');
    //self = this;

    this.game.state.states[this.pickedGame].assignscope(this);

    //this.pickGameService.currentGame.subscribe(game => this.pickedGame = game)
  }

  ionViewDidLeave(){
    this.game.destroy();
  }

}
