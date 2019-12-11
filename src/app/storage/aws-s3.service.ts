import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { StoreBaseService } from './storage-base.service';
import { NetworkService, ConnectionStatus } from './network.service';
import { EncrDecrService } from '../storage/encrdecrservice.service';

import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})

export class AwsS3Service extends StoreBaseService {
  currentFile: File;

  constructor(
     encrDecr: EncrDecrService,
     networkSvc: NetworkService
  ) { 
    super(encrDecr, networkSvc);
  }

  upload(result){
    var bucketName =  environment.awsConfig.bucketName;
    var bucketRegion = environment.awsConfig.bucketRegion;
    var IdentityPoolId = environment.awsConfig.IdentityPoolId;
    var accessKeyId = environment.awsConfig.accessKeyId;
    var secretAccessKey = environment.awsConfig.secretAccessKey;
    
    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });
    
    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucketName},
      //accessKeyId: accessKeyId,
      //secretAccessKey: secretAccessKey
    });  

    var fileName = "result"+result['endtimeUTC']+".json";
    this.currentFile = new File([JSON.stringify(result)], fileName, {type: "text/plain"});
    console.log("result"+result['endtimeUTC']+".json"+" key: "+fileName);

    s3.upload({
      Bucket: bucketName,
      Key: fileName, //this.currentFile.name,
      Body: this.currentFile,
      ACL: 'public-read'
    }, function(err, data) {
      if (err) {
        //alert('There was an error uploading your photo: '+err.message);
        console.log('There was an error uploading your file: '+err.message);
        this.storeResultLocally(result);
      }
      console.log('Successfully uploaded survey to s3.');
    });  
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
        this.upload(op);        //upload data from local storage, already sved, not need to save again
      }
    }
      
  }


}
