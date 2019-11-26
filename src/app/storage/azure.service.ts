import { Injectable } from '@angular/core';
import { BlobService, UploadConfig, UploadParams } from 'angular-azure-blob-service'
import { environment } from '../../environments/environment';
import { StoreBaseService } from './storage-base.service';
import { EncrDecrService } from '../storage/encrdecrservice.service';
import { NetworkService, ConnectionStatus } from './network.service';

//angular-azure-blob-service
const Config: UploadParams = {
  sas: environment.azureConfig.sas,
  storageAccount:  environment.azureConfig.storageAccount,
  containerName: environment.azureConfig.containerName
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
    networkSvc: NetworkService,
    private blobsvc: BlobService
  ) { 
    super(encrDecr, networkSvc);
  }

  upload (result) {
    //var fileDir = cordova.file.externalDataDirectory; 
    this.currentFile = new File([JSON.stringify(result)], "result-Azure.json", {type: "text/plain"});
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
          console.log('Error:', err);
          //if(saveToLocal) {
            this.storeResultLocally(result);
          //}
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
        //upload current survey Data
        this.upload(result);
    } else {
        this.storeResultLocally(result);
    }
      
  }    
  
    //upload local data
    uploadLocalData() {
      var storedObj = this.getLocalData();
      if(storedObj != null) {
        this.clearLocalData();
        var surveyArray = storedObj['storedSurvey'];
        for (let op of surveyArray) {
          this.upload(op);
        }
      }
 
    }

}
