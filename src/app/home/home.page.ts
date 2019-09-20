import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
//import { PickGameService } from '../incentive/aquarium/demo-aquarium/pick-game.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pickedGame:string;
  totalPoints;
  constructor(private router: Router){}

  pickGame(pickedGame){
    this.pickedGame = pickedGame;
    //this.pickGameService.sendGameState(pickedGame);    
    if(this.pickedGame == 'Game') {
      this.totalPoints = 1000;
    } else if(this.pickedGame == 'GameSmall')
    {
      this.totalPoints = 770;
    }
    else if(this.pickedGame == 'Level1')
    {
      this.totalPoints = 2000;
    }
    else if(this.pickedGame == 'Level1Small')
    {
      this.totalPoints = 1700;
    }
    else {
      this.totalPoints = -1;
    }
    console.log("pickGame "+pickedGame+" totalPoints: "+this.totalPoints);   

  }

  startGame(){
    console.log("totalPoints: "+this.totalPoints);
    let navigationExtras: NavigationExtras = {
      state: {
        totalPoints: this.totalPoints
      }
    };   

    this.router.navigate(['incentive/aquariumone'], navigationExtras);
  }


}