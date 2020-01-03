import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptedSurveyComponent } from './prompted-survey/prompted-survey.component';
import { MorningReportComponent } from './morning-report/morning-report.component';
import { InitiatedDrinkComponent } from './initiated-drink/initiated-drink.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StorageModule } from '../storage/storage.module';
import { ActivetaskComponent } from './activetask/activetask.component';
import { ActiveTask2Component } from './active-task2/active-task2.component';
import { DynamicSurveyComponent } from './dynamic-survey/dynamic-survey.component';
import { SampleSurveyComponent } from './sample-survey/sample-survey.component';
import { UserModule } from '../user/user.module';
import { AyaSurveyComponent } from './aya-survey/aya-survey.component';
import { CaregiverSurveyComponent } from './caregiver-survey/caregiver-survey.component';

@NgModule({
  declarations: [InitiatedDrinkComponent,MorningReportComponent,PromptedSurveyComponent,ActivetaskComponent,DynamicSurveyComponent,ActiveTask2Component,SampleSurveyComponent, AyaSurveyComponent, CaregiverSurveyComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    StorageModule,
    UserModule
  ],
  exports:[
    InitiatedDrinkComponent,
    MorningReportComponent,
    PromptedSurveyComponent,
    ActivetaskComponent,
    ActiveTask2Component,
    DynamicSurveyComponent,
    SampleSurveyComponent,
    AyaSurveyComponent,
    CaregiverSurveyComponent

  ]
})
export class SurveyModule { }
