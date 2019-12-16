import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DynamicSurveyComponent } from 'src/app/survey/dynamic-survey/dynamic-survey.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports:[
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AquariumModule { }
