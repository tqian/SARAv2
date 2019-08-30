import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import * as AWS from 'aws-sdk';
import { StoreBaseService } from './storage-base.service';
import { EncrDecrService } from '../storage/encrdecrservice.service';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class AwsS3Service extends StoreBaseService{
  currentFile: File;
  constructor(    
    encrDecr: EncrDecrService,
    storage: Storage,
    networkSvc: NetworkService,
    toastController: ToastController
  ) { 
    super(encrDecr, storage, networkSvc, toastController );
  }
  
  upload(result, current){
    var bucketName =  environment.awsConfig.bucketName;
    var bucketRegion = environment.awsConfig.bucketRegion;
    var IdentityPoolId = environment.awsConfig.IdentityPoolId;
    
    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });
    
    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucketName}
    });  
    
    this.currentFile = new File([JSON.stringify(this.encrypt(result))], "result.json", {type: "text/plain"});

    s3.upload({
      Bucket: bucketName,
      Key: this.currentFile.name,
      Body: this.currentFile,
      ACL: 'public-read'
    }, function(err, data) {
      if (err) {
        //return alert('There was an error uploading your photo: '+err.message);
        alert('There was an error uploading your photo: '+err.message);
        if(current) {
          this.storeResultLocally(result);
        }

      }
      console.log('Successfully uploaded data.');
    });  
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
