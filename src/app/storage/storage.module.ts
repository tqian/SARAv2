import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { StoreToFirebaseService } from './store-to-firebase.service';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
//import { EncrDecrService } from './encrdecrservice.service';
 
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    IonicStorageModule.forRoot()
  ],
  providers: [ 
    Network ]
})
export class StorageModule { }
