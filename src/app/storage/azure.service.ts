import { Injectable } from '@angular/core';

import { BlobService, UploadConfig, UploadParams } from 'angular-azure-blob-service'
import { environment } from '../../environments/environment';
import { StoreBaseService } from './storage-base.service';
import { EncrDecrService } from '../storage/encrdecrservice.service';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

//angular-azure-blob-service
const Config: UploadParams = {
  sas: environment.azureConfig.sas,
  storageAccount:  environment.azureConfig.storageAccount,
  containerName:  environment.azureConfig.containerName
};

@Injectable({
  providedIn: 'root'
})


export class AzureService extends StoreBaseService{
  currentFile: File;
  config: UploadConfig;
  private percent: number;

  constructor(    
    encrDecr: EncrDecrService,
    storage: Storage,
    networkSvc: NetworkService,
    toastController: ToastController,
    private blobsvc: BlobService
  ) { 
    super(encrDecr, storage, networkSvc, toastController );
  }

  upload (result, current) {
    //var fileDir = cordova.file.externalDataDirectory; 
      //this.currentFile = new File([JSON.stringify(result)], "result-Azure.json", {type: "text/plain"});
    this.currentFile = new File([JSON.stringify(this.encrypt(result))], "result-Azure.json", {type: "text/plain"});
    const baseUrl = this.blobsvc.generateBlobUrl(Config, this.currentFile.name);
    this.config = {
      baseUrl: baseUrl,
      sasToken: Config.sas,
      blockSize: 1024 * 64, // OPTIONAL, default value is 1024 * 32
      file: this.currentFile,
      complete: () => {
        console.log('Transfer completed !');
      },
      error: (err) => {
        alert('Error:'+err.message);
        if(current) {
          this.storeResultLocally(result);
        }
      },
      progress: (percent) => {
        this.percent = percent;
      }
    };

    this.blobsvc.upload(this.config);

  }

  uploadSurveyResult(result) {
    if(this.networkSvc.getCurrentNetworkStatus() == ConnectionStatus.Online){
        //upload Local Data first
        this.uploadLocalData();
        this.clearLocalData();
        //upload current survey Data
        this.upload(result, true);
    } else {
        this.storeResultLocally(result);
    }
      
  }    
  
    //upload local data
    uploadLocalData() {
      this.getLocalData().then(storedOperations => {
        let storedObj = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {
          for (let op of storedObj) {
            this.upload([op.data], false);
          }
        }
      });   
    }

}
