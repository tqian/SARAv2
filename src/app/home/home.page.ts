import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
//import { PickGameService } from '../incentive/aquarium/demo-aquarium/pick-game.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pickedGame;
  constructor(private router: Router){}

  pickGame(pickedGame){
    console.log("pickGame "+pickedGame);   
    this.pickedGame = pickedGame;
    //this.pickGameService.sendGameState(pickedGame);     
  }

  startGame(){
    let navigationExtras: NavigationExtras = {
      state: {
        game: this.pickedGame
      }
    };   

    this.router.navigate(['incentive/aquariumone'], navigationExtras);
  }


}