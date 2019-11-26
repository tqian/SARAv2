import { Injectable } from '@angular/core';

import { EncrDecrService } from '../storage/encrdecrservice.service';
import { NetworkService, ConnectionStatus } from './network.service';

const STORAGE_REQ_KEY = 'surveyResult';

@Injectable({
    providedIn: 'root'
})

export class StoreBaseService {

    constructor(
        protected encrDecr: EncrDecrService,
        protected networkSvc: NetworkService       
    ) { 
    }

    protected encrypt(result){
        var obj = {};
        var encrypted = this.encrDecr.encrypt(JSON.stringify(result), "Z&wz=BGw;%q49/<)");    
        obj['encrypted'] = encrypted;
        return obj;
    }

    protected decrypt(encrypted){
        return this.encrDecr.decrypt(encrypted, "Z&wz=BGw;%q49/<)");
    }
         
    protected storeResultLocally(surveyResult) {
        // let toast = this.toastController.create({
        //   message: `Your data is stored locally because you seem to be offline.`,
        //   duration: 3000,
        //   position: 'bottom'
        // });
        // toast.then(toast => toast.present());

        if(this.getLocalData() == null) {
            var storedObj = {};
            storedObj['storedSurvey'] = [surveyResult];
            console.log("getLocalData() == null "+JSON.stringify(storedObj));
            return window.localStorage.setItem(STORAGE_REQ_KEY, JSON.stringify(storedObj));
        } else {
            var obj = this.getLocalData();
             var surveyArray = obj["storedSurvey"];
             console.log("savedArray: "+surveyArray);
             surveyArray.push(surveyResult);
             obj["storedSurvey"] = surveyArray;
             console.log("getLocalData() != null "+JSON.stringify(obj));
             window.localStorage.setItem(STORAGE_REQ_KEY, JSON.stringify(obj));
            
        }
    }
    
    protected getLocalData(){
        if(window.localStorage.getItem(STORAGE_REQ_KEY) == undefined) return null;
        return JSON.parse(window.localStorage.getItem(STORAGE_REQ_KEY));
    }

    protected clearLocalData(){
        window.localStorage.removeItem(STORAGE_REQ_KEY);
    }  

}

  