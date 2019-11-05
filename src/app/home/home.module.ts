import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IncentiveModule } from '../incentive/incentive.module';
import {UserModule} from '../user/user.module';

import { HomePage } from './home.page';
import { fork } from 'child_process';

@NgModule({
  imports: [
    CommonModule,
    UserModule,
    FormsModule,
    IonicModule,
    IncentiveModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
