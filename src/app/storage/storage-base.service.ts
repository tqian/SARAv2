import { Injectable } from '@angular/core';

import { AppInjector } from './app-injector.service';
import { EncrDecrService } from '../storage/encrdecrservice.service';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

const STORAGE_REQ_KEY = 'surveyResult';
interface StoredRequest {
    data: any,
    time: number
}

@Injectable({
    providedIn: 'root'
})

export class StoreBaseService {
    //protected encrDecr: EncrDecrService;    
    //protected storage: Storage;
    //protected networkSvc: NetworkService;    
    //protected toastController: ToastController;


    constructor(
        protected encrDecr: EncrDecrService,
        protected storage: Storage,
        protected networkSvc: NetworkService,
        protected toastController: ToastController
        ) { 
        // Manually retrieve the dependencies from the injector    
        // so that constructor has no dependencies that must be passed in from child    
        //const injector = AppInjector.getInjector();    
        //setTimeout(() => this.encrDecr = injector.get(EncrDecrService));    
        //setTimeout(() => this.networkSvc = injector.get(NetworkService));    
        //setTimeout(() => this.storage = injector.get(Storage));    
        //setTimeout(() => this.toastController = injector.get(ToastController));    
    
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
        let toast = this.toastController.create({
          message: `Your data is stored locally because you seem to be offline.`,
          duration: 3000,
          position: 'bottom'
        });
        toast.then(toast => toast.present());
          
        let action: StoredRequest = {
            data: surveyResult,
            time: new Date().getTime(),
        };
          
        return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
            let storedObj = JSON.parse(storedOperations);
        
            if (storedObj) {
                storedObj.push(action);
            } else {
                storedObj = [action];
            }
            // Save old & new local transactions back to Storage
            return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
        });
    }
    
    protected getLocalData(){
        return this.storage.get(STORAGE_REQ_KEY);
    }

    protected clearLocalData(){
        this.storage.remove(STORAGE_REQ_KEY);
    }  


}

  