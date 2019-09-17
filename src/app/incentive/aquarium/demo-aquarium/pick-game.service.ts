
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class PickGameService {

  private messageSource = new BehaviorSubject('');
  currentGame = this.messageSource.asObservable();

  constructor() { }

  sendGameState(message: string) {
    console.log("sendGameState "+message);
    this.messageSource.next(message)
  }

}