import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { StoreBaseService } from './storage-base.service';
import { EncrDecrService } from '../storage/encrdecrservice.service';
import { NetworkService, ConnectionStatus } from './network.service';

@Injectable({
  providedIn: 'root',
})
export class StoreToFirebaseService extends StoreBaseService {

  constructor(
    encrDecr: EncrDecrService,
    networkSvc: NetworkService,
    private afs: AngularFirestore
  ) { 
    super(encrDecr, networkSvc);
  }
  
  addSurvey(path, obj: object){
    console.log("Start to addSurvey!");
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(path).add(obj)
      .then (
        (res) => {
          resolve(res)
        },
        err => {
          //if(saveToLocal) {
            console.log("inside addSurvey err, before caling storeResultLocally!");
            this.storeResultLocally(obj);
          //}    
          reject(err)
        }
      )
    }) 
  }   
  
  uploadSurveyResult(path, obj: object) {
    if(this.networkSvc.getCurrentNetworkStatus() == ConnectionStatus.Online){
        //upload Local Data first
        this.uploadLocalData(path);
         //upload current survey Data
        this.addSurvey(path, obj);
    } else {
      console.log("uploadSurveyResult: offline!");
      this.storeResultLocally(obj);
    }
      
  }    
  
    //upload local data
    uploadLocalData(path) {
      var storedObj = this.getLocalData();
      if(storedObj != null) {
        this.clearLocalData();
        var surveyArray = storedObj['storedSurvey'];
        console.log("uploadLocalData storedObj!=null ");
        if ( surveyArray.length > 0) {
          for (let op of surveyArray) {
            this.addSurvey(path, op);
          }
        }
      }

    }      

}
