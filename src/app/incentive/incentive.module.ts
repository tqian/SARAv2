import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AwardComponent } from './award/award.component';
import { AwardMemesComponent } from './award-memes/award-memes.component';
//import { VisualizationComponent } from './visualization/visualization.component';
import { DemoAquariumComponent } from './aquarium/demo-aquarium/demo-aquarium.component';
import { DemoReinforestComponent } from './aquarium/demo-reinforest/demo-reinforest.component';


@NgModule({
  declarations: [AwardComponent, AwardMemesComponent, DemoAquariumComponent, DemoReinforestComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports:[AwardComponent, AwardMemesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IncentiveModule { }
