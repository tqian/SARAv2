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
import { Routes, RouterModule } from '@angular/router';
import { SampleSurveyComponent } from './sample-survey/sample-survey.component';

/* const routes: Routes = [
  { path: 'initated-drink', component: InitiatedDrinkComponent },
  { path: 'activetask', component: ActivetaskComponent },
  { path: 'activetask2', component: ActiveTask2Component },
  { path: 'dynamicsurvey', component: DynamicSurveyComponent }, 
]; */

@NgModule({
  declarations: [InitiatedDrinkComponent,MorningReportComponent,PromptedSurveyComponent,ActivetaskComponent,DynamicSurveyComponent,ActiveTask2Component,SampleSurveyComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    //RouterModule.forChild(routes),
    FormsModule,
    StorageModule
  ],
  exports:[
    InitiatedDrinkComponent,
    MorningReportComponent,
    PromptedSurveyComponent,
    ActivetaskComponent,
    ActiveTask2Component,
    DynamicSurveyComponent,
    SampleSurveyComponent
  ]
})
export class SurveyModule { }
