import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import { SaveDataService } from '../save-data.service';
import { StoreToFirebaseService } from '../../storage/store-to-firebase.service';
import { AwsS3Service } from '../../storage/aws-s3.service';
import { Question } from '../question';
import { AzureService } from '../../storage/azure.service';

declare var cordova: any;

@Component({
  selector: 'app-initiated-drink',
  templateUrl: './initiated-drink.component.html',
  styleUrls: ['./initiated-drink.component.scss'],
})

export class InitiatedDrinkComponent implements OnInit {
  @Input() question: Question;
  //response: any; 

  constructor(
    private httpClient: HttpClient,
    private file: File,
    private saveDataService : SaveDataService,
    private storeToFirebaseService: StoreToFirebaseService,
    private awsS3Service: AwsS3Service,
    private azureService: AzureService
    ) {

      this.question = new Question({
        ID: 'Q1',
        label: 'Are you starting your first drink?',
        result1: false,
        result2: false
        });
     }

  ngOnInit() {}

  loadJson(){
    //let obs = this.httpClient.get('assets/data/data.json');
    //obs.suscribe((response) => {
    //  this.response = response;
    // console.log(response);
    //});

  }

  storeData(){
    console.log("Inside storeData");
    console.log(this.question);
    console.log(JSON.stringify(this.question));
    this.saveDataService.saveData("SurveyResult", this.question);

    //var jsonString = JSON.stringify(surveyResult);
    //var fileDir = cordova.file.externalApplicationStorageDirectory; 
    //var filename = "result.json";
    //var file = new File([jsonString], fileDir+filename, {type: "text/plain;charset=utf-8"});
    //this.file.writeFile(fileDir, filename, jsonString, {replace: true}) ; 
    //this.file.readAsArrayBuffer(fileDir, filename).then(async(buffer) => {
    //  await this.upload(buffer, filename);
    //});
    
    //this.storeToFirebaseService.initFirebase();
    //this.storeToFirebaseService.storeTofirebase(surveyResult);

    //this.storeToFirebaseService.addSurvey('/results',this.question.getData());
    
    //save to Amazon AWS S3
    this.awsS3Service.upload(this.question.getData());
    console.log("End of storeData");

    //save to azure 
    this.azureService.upload(this.question.getData());

    //this.saveDataService.browseToReward('/incentive/award');
    this.saveDataService.browseToReward('incentive/visualization');
  }

  printValue(){
    console.log('Checked:' + this.question.result1);
  }

  //href="/incentive/award"


}
