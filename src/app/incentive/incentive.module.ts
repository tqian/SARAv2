import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
//import { AwardComponent } from './award/award.component';
import { AwardMemesComponent } from './award-memes/award-memes.component';
//import { VisualizationComponent } from './visualization/visualization.component';
//import { DemoAquariumComponent } from './aquarium/demo-aquarium/demo-aquarium.component';
//import { SurveyModule } from '../survey/survey.module';
import { Routes, RouterModule } from '@angular/router';
import { SampleLifeInsightsComponent } from './life-insights/sample-life-insights/sample-life-insights.component';

const routes: Routes = [
//  { path: 'award', component: AwardComponent },
  { path: 'award-memes', component: AwardMemesComponent },
  { path: 'sample-life-insight', component: SampleLifeInsightsComponent }
//  { path: 'visualization', component: VisualizationComponent }
];

@NgModule({
  declarations: [
    //AwardComponent, 
    AwardMemesComponent, 
    SampleLifeInsightsComponent
    //VisualizationComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  exports:[
    //AwardComponent, 
    AwardMemesComponent, 
    SampleLifeInsightsComponent
    //VisualizationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IncentiveModule { }
