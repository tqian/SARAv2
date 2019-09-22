import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Q1MotivatedComponent } from './q1-motivated/q1-motivated.component';

@NgModule({
  declarations: [Q1MotivatedComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports:[Q1MotivatedComponent]
})
export class LifeInsightsModule { }
