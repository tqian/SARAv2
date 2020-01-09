/* Installation:

ionic install @ionic-native/sqlite @ionic-native/sqlite-porter
ionic cordova plugin add cordova-sqlite-storage
ionic cordova plugin add uk.co.workingedge.cordova.plugin.sqliteporter

Follow reference: https://devdactic.com/ionic-4-sqlite-queries/
*/

import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';

export interface TrackObj {
  id: number,
  pageName: string,
  eventTime: Date,
  eventStatus: string,
  userID: number
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
 
  tracks = new BehaviorSubject([]);

  constructor(
    private plt: Platform, 
    private sqlitePorter: SQLitePorter, 
    private sqlite: SQLite, 
    private http: HttpClient) {  
       this.plt.ready().then(() => {
        this.sqlite.create({
          name: 'tracks.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
            this.database = db;
            //this.deleteTable();
            //console.log("table deleted!");
            this.createDatabase();
        }); 
      });      
    }

    createDatabase() {
      console.log("start seedDatabase!");
      return this.http.get('assets/track.sql', { responseType: 'text' })
        .subscribe(sql => {
          this.sqlitePorter.importSqlToDb(this.database, sql)
            .then(_ => {
              console.log('Before displayTracks');
              this.displayTracks();
              console.log('Tracks displayed');
              this.dbReady.next(true);
            })
            .catch(e => console.error("In seedDatabase:" + e));
        });
    }    

    getDatabaseState() {
      return this.dbReady.asObservable();
    }
    
    getTracks(): Observable<any[]> {
      return this.tracks.asObservable();
    }    

    deleteTable(){
      return this.database.executeSql('DROP TABLE tracks').then(data => {
        console.log('Table deleted!');
      }).catch(e => console.log("deleteTable:"+e));
    }

    addTrack(pageName, eventStatus, userID) {
      var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a Z');
      let data = [pageName, currentTime, eventStatus, userID];
      return this.database.executeSql('INSERT INTO tracks (pageName, eventTime, eventStatus, userID) VALUES (?, ?, ?, ?)', data).then(data => {
        console.log('Track added!');
        this.displayTracks();
      }).catch(e => console.log("In addTrack:"+e));
    }   
    
    displayTracks() {
      //let query = 'SELECT product.name, product.id, developer.name AS creator FROM product JOIN developer ON developer.id = product.creatorId';
      return this.database.executeSql('SELECT * FROM tracks', []).then(data => {
        let currentTracks: TrackObj[] = [];
        var rowlength = data.rows.length;
        console.log("data.rows= "+rowlength);
        if (rowlength > 0) {
          for (var i = 0; i < rowlength; i++) {
            console.log("data.rows= "+rowlength);
            console.log("displayTracks "+i+" pageName: "+data.rows.item(i).pageName);
            console.log("displayTracks "+i+" time: "+data.rows.item(i).eventTime);
            currentTracks.push({ 
              id: data.rows.item(i).id,
              pageName: data.rows.item(i).pageName,
              eventTime: data.rows.item(i).eventTime,
              eventStatus: data.rows.item(i).eventStatus,
              userID: data.rows.item(i).userID,
             });
          }
          //console.log("currentTracks length: "+currentTracks.length);
        }
        //this.tracks.next(currentTracks);  announce new value to all subscribers
      }).catch(e => console.log("In displayTracks:"+e));
    }

}
