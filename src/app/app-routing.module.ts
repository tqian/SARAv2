import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InitiatedDrinkComponent } from './survey/initiated-drink/initiated-drink.component';
import { AwardComponent } from './incentive/award/award.component';
import { AwardMemesComponent } from './incentive/award-memes/award-memes.component';
import { ActivetaskComponent } from './survey/activetask/activetask.component';
import { ActiveTask2Component } from './survey/active-task2/active-task2.component';
import { VisualizationComponent } from './incentive/visualization/visualization.component';
import { DynamicSurveyComponent } from './survey/dynamic-survey/dynamic-survey.component';
import { DemoAquariumComponent } from './incentive/aquarium/demo-aquarium/demo-aquarium.component';
import { Q1MotivatedComponent } from './incentive/life-insights/q1-motivated/q1-motivated.component';
import { SampleSurveyComponent } from './survey/sample-survey/sample-survey.component';
import { SampleLifeInsightsComponent } from './incentive/life-insights/sample-life-insights/sample-life-insights.component';
import { AuthGuard } from './user/auth/auth.guard';
import { AuthComponent } from './user/auth/auth.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' , canActivate: [AuthGuard]},
  {path: 'auth', component: AuthComponent},
  // { path: 'home', loadChildren: () => import('./home/home.module').then(m=> m.HomePageModule) },  
  { path: 'home', loadChildren: './home/home.module#HomePageModule'  , canActivate: [AuthGuard]},
  { path: 'survey/initated-drink', component: InitiatedDrinkComponent , canActivate: [AuthGuard] },
  //{ path: 'survey/activetask', component: ActivetaskComponent },
  { path: 'survey/activetask2', component: ActiveTask2Component , canActivate: [AuthGuard] },
  { path: 'survey/dynamicsurvey', component: DynamicSurveyComponent , canActivate: [AuthGuard] }, 
  { path: 'survey/samplesurvey', component: SampleSurveyComponent  , canActivate: [AuthGuard]}, 
  { path: 'incentive/award', component: AwardComponent , canActivate: [AuthGuard] },
  { path: 'incentive/award-memes', component: AwardMemesComponent , canActivate: [AuthGuard] },
  { path: 'incentive/visualization', component: VisualizationComponent , canActivate: [AuthGuard]},
  { path: 'incentive/aquariumone', component: DemoAquariumComponent , canActivate: [AuthGuard] },  
  { path: 'life-insight/q1lifeinsight', component: Q1MotivatedComponent , canActivate: [AuthGuard] },
  { path: 'incentive/sample-life-insight', component: SampleLifeInsightsComponent , canActivate: [AuthGuard] } 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
