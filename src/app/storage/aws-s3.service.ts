import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class AwsS3Service {
  currentFile: File;

  constructor() { }

  upload(subfolder, result){
    var bucketName =  environment.awsConfig.bucketName;
    var bucketRegion = environment.awsConfig.bucketRegion;
    var IdentityPoolId = environment.awsConfig.IdentityPoolId;
    //var accessKeyId = environment.awsConfig.accessKeyId;
    //var secretAccessKey = environment.awsConfig.secretAccessKey;
    
    
    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });
    
    
    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucketName},
    });  

    var fileName = "result"+new Date().getTime()+".json";
    this.currentFile = new File([JSON.stringify(result)], fileName, {type: "text/plain"});

    s3.upload({
      Bucket: bucketName,
      Key: subfolder+"/"+fileName,
      Body: this.currentFile,
      //ACL: 'public-read'
    }, function(err, data) {
      if (err) {
        //return alert('There was an error uploading your photo: '+err.message);
        console.log('There was an error uploading your file: '+err.message);
      }
      console.log('Successfully uploaded file: '+fileName);
    });  
  }

}
