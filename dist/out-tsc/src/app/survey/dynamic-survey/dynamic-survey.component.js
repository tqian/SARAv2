//
//--- The goal of this file is to dynamically generate a survey from a JSON file. 
//--- Example JSON files are located in assets/survey folder. 
//
//--- At a high level, this file does the following:
//      (i) reads a JSON file in the "ngAfterViewInit" 
//      (ii) calls the "generateSurvey" function to create html codes for the survey
//      (iii) creates a component dynamically and attached it to the "vc" component.
import * as tslib_1 from "tslib";
import { Component, ViewChild, ViewContainerRef, NgModule, Compiler, Injector, NgModuleRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AwsS3Service } from '../../storage/aws-s3.service';
import { EncrDecrService } from '../../storage/encrdecrservice.service';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppVersion } from '@ionic-native/app-version/ngx';
//import * as lifeInsightProfile from "../../../assets/data/life_insight.json";
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { AwardDollarService } from 'src/app/incentive/award-money/award-dollar.service';
var DynamicSurveyComponent = /** @class */ (function () {
    function DynamicSurveyComponent(_compiler, _injector, _m, awsS3Service, 
    //private storeToFirebaseService: StoreToFirebaseService,
    EncrDecr, router, ga, changeDetector, appVersion, alertCtrl, plt, userProfileService, awardDollarService) {
        var _this = this;
        this._compiler = _compiler;
        this._injector = _injector;
        this._m = _m;
        this.awsS3Service = awsS3Service;
        this.EncrDecr = EncrDecr;
        this.router = router;
        this.ga = ga;
        this.changeDetector = changeDetector;
        this.appVersion = appVersion;
        this.alertCtrl = alertCtrl;
        this.plt = plt;
        this.userProfileService = userProfileService;
        this.awardDollarService = awardDollarService;
        this.title = "mash is here";
        this.isLoading = true;
        this.loadingComplete = false;
        this.survey_string = "";
        this.survey = {};
        this.appVersion.getVersionNumber().then(function (value) {
            _this.versionNumber = value;
            console.log("VersionNumber: " + _this.versionNumber);
        }).catch(function (err) {
            console.log(err);
        });
    }
    DynamicSurveyComponent.prototype.ngOnInit = function () { };
    DynamicSurveyComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('Reading local json files: ' + this.fileLink);
        //fetch JSON file and once the file is fetched called "generateSurvey" to create the survey.
        fetch('../../../assets/data/' + this.fileLink + '.json').then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, res.json()];
                    case 1:
                        _a.survey_data = _b.sent();
                        this.generateSurvey();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    DynamicSurveyComponent.prototype.generateSurvey = function () {
        var _this = this;
        //go through the questions
        this.survey = {};
        for (var i = 0; i < this.survey_data.length; i++) {
            var obj = this.survey_data[i];
            //console.log("Done " + obj.text);
            this.survey[obj.name] = "";
            this.survey_string = this.process_survey(obj, this.survey_string, obj.name);
        }
        this.survey_string = this.survey_string + '<div class="ion-padding"><button class="buttonold button-positive" (click)="submitSurvey()">Submit</button></div>';
        //---
        //--- Generate a survey component dynamically from the "survey_string."
        //--- The "survey_string" contains all the HTML for the template for dynamic component
        //--- 
        var surveyComponent = Component({ template: this.survey_string })(/** @class */ (function () {
            function class_1() {
                this.survey2 = {};
                this.isQuestionIncomplete = {};
                this.lifeInsightObj = {};
                this.totalPoints = 0;
                this.survey_data = [];
            }
            class_1.prototype.ngOnInit = function () {
                this.survey2['starttimeUTC'] = new Date().getTime();
                this.survey2['reponse_ts'] = {};
                for (var i = 0; i < this.survey_data.length; i++) {
                    var obj = this.survey_data[i];
                    this.isQuestionIncomplete[obj.name] = { "tag": obj.tag };
                }
            };
            class_1.prototype.ngAfterViewInit = function () {
                var _this = this;
                setTimeout(function (e) { return _this.drawMoodGrid(_this); }, 200);
            };
            class_1.prototype.drawMoodGrid = function (self2) {
                var c = document.getElementById("myCanvas");
                if (c == null) {
                    console.log("is null");
                    return;
                }
                c.style.width = '100%';
                c.width = c.offsetWidth;
                c.height = c.width;
                var ctx = c.getContext("2d");
                var imageObj = new Image();
                imageObj.src = 'assets/pics/affect_grid.png';
                imageObj.onload = function () {
                    ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, // source rectangle
                    0, 0, c.width, c.height); // destination rectangle
                };
                //corner points
                var top_x = (42.0 / 354.0) * c.width;
                var top_y = (32.0 / 354.0) * c.height;
                var bottom_x = (320.0 / 354.0) * c.width;
                var bottom_y = (320.0 / 354.0) * c.height;
                c.addEventListener("click", function (e) {
                    //drawing = true;
                    var rect = c.getBoundingClientRect();
                    var lastPos = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    };
                    //console.log("x:" + lastPos.x + ", y:" + lastPos.y + ":::: " + c.width + "," + c.height);
                    var x = -1;
                    var y = -1;
                    if ((lastPos.x >= top_x) && (lastPos.y >= top_y) && (lastPos.x <= bottom_x) && (lastPos.y <= bottom_y)) {
                        x = 10 * (lastPos.x - top_x) / (bottom_x - top_x) - 5;
                        y = 5 - 10 * (lastPos.y - top_y) / (bottom_y - top_y) - 5;
                        console.log("x:" + x + ", y:" + y);
                        self2.survey2['QMood'] = "" + x + ":" + y;
                        //
                        self2.inputchanged("QMood");
                    }
                    else {
                        return;
                    }
                    var rect = c.getBoundingClientRect();
                    ctx.beginPath();
                    ctx.clearRect(0, 0, rect.right - rect.left, rect.bottom - rect.top);
                    ctx.closePath();
                    //
                    ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, // source rectangle
                    0, 0, c.width, c.height); // destination rectangle
                    //ctx.drawImage(imageObj, 0, 0);
                    ctx.beginPath();
                    ctx.arc(lastPos.x, lastPos.y, 10, 0, 2 * Math.PI);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'red';
                    ctx.stroke();
                }, false);
            };
            //This function tracks if users clicked on a survey question
            class_1.prototype.modelChanged = function (newObj) {
                console.log('holla' + newObj);
            };
            //This function tracks if users clicked on a survey question and reacts.       
            class_1.prototype.inputchanged = function (questions) {
                //console.log('holla: ' + questions);
                this.survey2['reponse_ts'][questions] = {};
                this.survey2['reponse_ts'][questions].ts = Date.now();
                this.survey2['reponse_ts'][questions].readable_ts = moment().format("MMMM Do YYYY, h:mm:ss a");
                delete this.isQuestionIncomplete[questions]; //remove the key from isQuestionIncomplete
                console.log(JSON.stringify(this.survey2));
            };
            class_1.prototype.submitSurvey = function () {
                if (this.isEmpty(this.isQuestionIncomplete)) //means all questions have been removed
                    this.storeData();
                else {
                    var incompleteQuestions = "";
                    for (var prop in this.isQuestionIncomplete) {
                        incompleteQuestions = incompleteQuestions + " " + this.isQuestionIncomplete[prop]["tag"] + ",";
                    }
                    incompleteQuestions = incompleteQuestions.substring(0, incompleteQuestions.length - 1);
                    this.presentAlert("You haven't completed questions:" + incompleteQuestions);
                }
            };
            class_1.prototype.presentAlert = function (alertMessage) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var alert;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.alertCtrl.create({
                                    //<div style="font-size: 20px;line-height: 25px;padding-bottom:10px;text-align:center">Thank you for completing the survey. You have unlocked a meme.</div>
                                    //header: '<div style="line-height: 25px;padding-bottom:10px;text-align:center">Daily survey unavilable</div>',
                                    header: 'Daily survey unavilable',
                                    //subHeader: "Survey is not avaibable!",
                                    message: alertMessage,
                                    //defined in theme/variables.scss
                                    buttons: [{ text: 'OK', cssClass: 'secondary' }]
                                })];
                            case 1:
                                alert = _a.sent();
                                /*
                                let alert = this.alertCtrl.create({
                                  title: 'Low battery',
                                  subTitle: '10% of battery remaining',
                                  buttons: ['Dismiss']
                                });
                                */
                                return [4 /*yield*/, alert.present()];
                            case 2:
                                /*
                                let alert = this.alertCtrl.create({
                                  title: 'Low battery',
                                  subTitle: '10% of battery remaining',
                                  buttons: ['Dismiss']
                                });
                                */
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            };
            class_1.prototype.isEmpty = function (obj) {
                return JSON.stringify(obj) === JSON.stringify({});
            };
            class_1.prototype.storeData = function () {
                //console.log("Inside storeData");
                console.log(JSON.stringify(this.survey2));
                this.ga.trackEvent('Submit Button', 'Tapped Action', 'Submit the completed survey', 0);
                var endTime = new Date().getTime();
                var readable_time = moment().format('MMMM Do YYYY, h:mm:ss a Z');
                this.survey2['endtimeUTC'] = endTime;
                this.survey2['userName'] = this.userProfileService.username;
                this.survey2['ts'] = readable_time;
                this.survey2['devicInfo'] = this.plt.platforms();
                //Store app version number
                this.survey2['appVersion'] = this.versionNumber;
                this.userProfileService.versionNumber = this.versionNumber;
                var encrypted = this.EncrDecr.encrypt(JSON.stringify(this.survey2), "Z&wz=BGw;%q49/<)");
                //var encrypted = this.EncrDecr.encrypt("holla", "Z&wz=BGw;%q49/<)");
                var decrypted = this.EncrDecr.decrypt(encrypted, "Z&wz=BGw;%q49/<)");
                console.log('Encrypted :' + encrypted);
                console.log('Decrypted :' + decrypted);
                this.survey2['encrypted'] = encrypted;
                //compute and store "TotalPoints" to localStorage
                if (window.localStorage['TotalPoints'] == undefined)
                    this.totalPoints = 0;
                else
                    this.totalPoints = parseInt(window.localStorage['TotalPoints']);
                this.totalPoints = this.totalPoints + 60;
                window.localStorage.setItem("TotalPoints", "" + this.totalPoints);
                //get "awardDollars"
                var pastDollars = this.awardDollarService.getDollars();
                var dollars = this.awardDollarService.giveDollars();
                console.log("Dollars: " + dollars);
                this.userProfileService.surveyCompleted();
                window.localStorage.setItem("LastSurveyCompletionDate", "" + moment().format('YYYYMMDD'));
                window.localStorage.setItem("CurrentPoints", "" + this.userProfileService.points);
                window.localStorage.setItem("PreviousPoints", "" + (this.userProfileService.points - 60));
                window.localStorage.setItem("AwardedDollar", "" + (dollars - pastDollars));
                window.localStorage.setItem("IsModalShown", "false");
                //Save 7-day date and value for each question in localStorage to generate lifeInsight chart
                var lifeInsightProfile = {
                    "questions": ["Q3d", "Q4d", "Q5d", "Q8d"],
                    "qimgs": ["assets/img/stress.png", "assets/img/freetime.png", "assets/img/dance2.png", "assets/img/social.png"],
                    "lifeInsightsTitle": ["How much <b>pain</b> are you currently experiencing?",
                        "How much <b>fatigue</b> are you currently experiencing?",
                        "How much <b>nausea</b> are you currently experiencing?",
                        "How <b>motivated</b> are you to take 6MP today?"],
                    "qYaxis": ["Pain level", "Fatigue level", "Nausea level", "Degree of motivation"],
                    "qSubText": ["0 = low pain, 4 = severe pain",
                        "0 = low fatigue, 4 = severe fatigue",
                        "0 = low nausea, 4 = severe nausea",
                        "0 = less motivated, 4 = highly motivated"],
                    "lifeInsightsHighStress": [
                        "Stressed <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>",
                        "Fatigued <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>",
                        "Nausea <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>",
                        "Motivated <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>"
                    ],
                    "lifeInsightsLowStress": [
                        "Relaxed <i class='em em-sunglasses'></i><i class='em em-boat'></i>",
                        "Fatigued <i class='em em-sunglasses'></i><i class='em em-boat'></i>",
                        "Nausea <i class='em em-sunglasses'></i><i class='em em-boat'></i>",
                        "Motivated <i class='em em-sunglasses'></i><i class='em em-boat'></i>"
                    ]
                };
                var questionsArray = lifeInsightProfile.questions; //["Q3d","Q4d","Q5d","Q8d"]
                if (window.localStorage['lifeInsight'] == undefined) {
                    for (var _i = 0, questionsArray_1 = questionsArray; _i < questionsArray_1.length; _i++) {
                        var question = questionsArray_1[_i];
                        this.lifeInsightObj[question] = {};
                        this.lifeInsightObj[question]['dates'] = [moment().format("DD-MM-YYYY")];
                        if (this.survey2.hasOwnProperty(question)) {
                            this.lifeInsightObj[question]['data'] = [parseInt(this.survey2[question])];
                        }
                        else {
                            this.lifeInsightObj[question]['data'] = [null];
                        }
                    }
                }
                else {
                    this.lifeInsightObj = JSON.parse(window.localStorage["lifeInsight"]);
                    for (var _a = 0, questionsArray_2 = questionsArray; _a < questionsArray_2.length; _a++) {
                        var question = questionsArray_2[_a];
                        var dateslength = this.lifeInsightObj[question]['dates'].length;
                        if (dateslength == 7) {
                            this.lifeInsightObj[question]['dates'].shift();
                            this.lifeInsightObj[question]['data'].shift();
                        }
                        var currentdate = moment().format("DD-MM-YYYY");
                        var dates = this.lifeInsightObj[question]["dates"];
                        var dateIndex = dates.indexOf(currentdate);
                        console.log("Current date exist? " + dateIndex);
                        if (dateIndex > -1) {
                            this.lifeInsightObj[question]['dates'][dateIndex] = currentdate;
                            if (this.survey2.hasOwnProperty(question)) {
                                this.lifeInsightObj[question]['data'][dateIndex] = (parseInt(this.survey2[question]));
                            }
                            else {
                                this.lifeInsightObj[question][dateIndex] = null;
                            }
                        }
                        else {
                            this.lifeInsightObj[question]['dates'].push(currentdate);
                            if (this.survey2.hasOwnProperty(question)) {
                                this.lifeInsightObj[question]['data'].push(parseInt(this.survey2[question]));
                            }
                            else {
                                this.lifeInsightObj[question]['data'].push(null);
                            }
                        }
                    }
                }
                console.log("lifeInsightObj: " + JSON.stringify(this.lifeInsightObj));
                window.localStorage.setItem("lifeInsight", JSON.stringify(this.lifeInsightObj));
                //save to Amazon AWS S3
                this.awsS3Service.upload(this.fileLink, this.survey2);
                //console.log("End of storeData");
                //navigate to award-memes/award-altruism with equal probability after submit survey
                var currentProb = Math.random();
                window.localStorage.setItem("Prob", "" + currentProb);
                var currentDate = moment().format('YYYYMMDD');
                var navigationExtras = {
                    state: {
                        date: currentDate,
                        prob: currentProb
                    }
                };
                //prepare reinforcement data to upload to AWS S3
                var reinforcement_data = {};
                reinforcement_data['userName'] = this.userProfileService.username;
                reinforcement_data['Prob'] = currentProb;
                reinforcement_data['day_count'] = Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length;
                reinforcement_data['isRandomized'] = 1; //what is this one??
                reinforcement_data['unix_ts'] = endTime;
                reinforcement_data['readable_ts'] = readable_time;
                reinforcement_data['date'] = currentDate;
                //save to Amazon AWS S3
                if (this.fileLink.includes('caregiver') || currentProb <= 0.4) {
                    var reinforcementObj = {};
                    reinforcementObj['ds'] = 1;
                    reinforcementObj['reward'] = 0;
                    reinforcementObj['prob'] = currentProb;
                    reinforcement_data['reward'] = "No push";
                    this.awsS3Service.upload('reinforcement_data', reinforcement_data);
                    //this.userProfileService.addReinforcementData(currentDate, reinforcementObj);    
                    navigationExtras['state']['IsShowModal'] = true;
                    this.router.navigate(['home'], navigationExtras);
                }
                else if ((currentProb > 0.4) && (currentProb <= 0.7)) {
                    reinforcement_data['reward'] = "Meme";
                    navigationExtras['state']['reinforcement_data'] = reinforcement_data;
                    this.router.navigate(['incentive/award-memes'], navigationExtras);
                }
                else if (currentProb > 0.7) {
                    reinforcement_data['reward'] = "Altruistic message";
                    navigationExtras['state']['reinforcement_data'] = reinforcement_data;
                    this.router.navigate(['incentive/award-altruism'], navigationExtras);
                }
            };
            return class_1;
        }()));
        var tmpModule = NgModule({ declarations: [surveyComponent], imports: [FormsModule] })(/** @class */ (function () {
            function class_2() {
            }
            return class_2;
        }()));
        this._compiler.compileModuleAndAllComponentsAsync(tmpModule)
            .then(function (factories) {
            _this.isLoading = false;
            _this.loadingComplete = true;
            //setTimeout(function(){ console.log("holla") }, 3000);
            _this.changeDetector.detectChanges();
            var f = factories.componentFactories[0];
            var cmpRef = _this.vc.createComponent(f);
            cmpRef.instance.awsS3Service = _this.awsS3Service;
            cmpRef.instance.survey2 = _this.survey;
            cmpRef.instance.fileLink = _this.fileLink;
            cmpRef.instance.versionNumber = _this.versionNumber;
            cmpRef.instance.survey_data = _this.survey_data;
            //cmpRef.instance.storeToFirebaseService = this.storeToFirebaseService;
            cmpRef.instance.alertCtrl = _this.alertCtrl;
            cmpRef.instance.userProfileService = _this.userProfileService;
            cmpRef.instance.awardDollarService = _this.awardDollarService;
            cmpRef.instance.EncrDecr = _this.EncrDecr;
            cmpRef.instance.ga = _this.ga;
            cmpRef.instance.plt = _this.plt;
            cmpRef.instance.router = _this.router; // Router,
            cmpRef.instance.name = 'dynamic';
            //console.log('called');
        });
    };
    DynamicSurveyComponent.prototype.getTitle = function () {
        return this.title;
    };
    // process survey if obj type is radiobutton
    DynamicSurveyComponent.prototype.process_survey_radiobutton = function (obj, survey_string, i) {
        //------------------------------------------------------ 
        //radio button, vertical     
        //------------------------------------------------------   
        if (obj.extra.orientation == "vertical") {
            survey_string = survey_string + '<div class="radiovertical"><ul>';
            for (var j = 0; j < obj.extra.choices.length; j++) {
                survey_string = [survey_string,
                    '<li><input type="radio" id="option' + i + "I" + j + '" name="' + i + '" [(ngModel)]="survey2.' + i + '" value=" ' + obj.extra.choices[j] + '" (change)="inputchanged(\'' + i + '\')">',
                    '<label for="option' + i + "I" + j + '">' + obj.extra.choices[j] + '</label>',
                    '<div class="check"></div></li>'
                ].join(" ");
            }
            //if(this.choices == undefined) this.choices = {};
            //this.choices[obj.name]= obj.extra.choices;
            survey_string = survey_string + '</ul></div>';
        }
        //------------------------------------------------------ 
        //radio button, horizontal     
        //------------------------------------------------------
        //console.log("Here: " + JSON.stringify(obj.extra.orientation) + ", " + obj.extra.choices.length);
        if (obj.extra.orientation == "horizontal") {
            survey_string = survey_string + '<div class="radiohorizontal"><ul>';
            //starting text
            survey_string = survey_string + '<li><p>' + obj.extra.choices[0] + '</p></li>';
            //middle text
            for (var j = 0; j < obj.extra.levels; j++) {
                survey_string = [survey_string,
                    '<li><input type="radio" id="option' + i + "I" + j + '" name="' + i + '" [(ngModel)]="survey2.' + i + '" value="' + j + '" (change)="inputchanged(\'' + i + '\')">',
                    '<label for="option' + i + "I" + j + '"></label>',
                    '<div class="check"></div></li>'
                ].join(" ");
                //console.log("" + j + ", " + obj.extra.choices.length);
            }
            //ending text
            survey_string = survey_string + '<li><p>' + obj.extra.choices[obj.extra.choices.length - 1] + '</p></li>';
            survey_string = survey_string + '</ul></div>';
        }
        return survey_string;
    };
    //
    // process survey for all types of objects
    // Our current questionaire only has radio buttons. We have codes for other types of inputs, which we will gradually add.
    //
    DynamicSurveyComponent.prototype.process_survey = function (obj, survey_string, i) {
        survey_string = [survey_string,
            '<div class="card"><div class="quetiontextstyle">',
            obj.text,
            '</div>'
        ].join(" ");
        if (obj.type == 'random') {
            //this.process_survey_random(obj, survey_string, i);
        }
        else {
            //
            if (obj.type == "captcha") {
                //survey_string = this.process_survey_captcha(obj, survey_string);
            }
            //------------------------------------------------------                  
            //text box  
            //------------------------------------------------------                 
            if (obj.type == "textbox") {
                //survey_string = this.process_survey_textbox(survey_string, i);
            }
            //------------------------------------------------------                  
            //time picker
            //------------------------------------------------------                 
            if (obj.type == "timepicker") {
                //survey_string = this.process_survey_timepicker(survey_string, i);
            }
            //------------------------------------------------------                  
            //paragraph
            //------------------------------------------------------                 
            if (obj.type == "comment") {
                //survey_string = this.process_survey_comment(survey_string);
            }
            //------------------------------------------------------                  
            //image
            //------------------------------------------------------  
            if (obj.type == "image") {
                //survey_string = this.process_survey_image(obj, survey_string);
            }
            //------------------------------------------------------
            //  mood
            //------------------------------------------------------
            if (obj.type == 'mood') {
                //survey_string = this.process_survey_mood(survey_string, i);
            }
            //------------------------------------------------------
            //  mood-grid
            //------------------------------------------------------
            if (obj.type == 'moodgrid') {
                //survey_string = this.process_survey_moodgrid(survey_string, i);
            }
            if (obj.type == "moodgrid2") {
                //survey_string = this.process_survey_moodgrid2(survey_string);
            }
            //------------------------------------------------------                  
            // Autocomplete 
            //------------------------------------------------------   
            // 'component-id="Q' + i + '" ' + 
            if (obj.type == 'autocomplete') {
                //survey_string = this.process_survey_autocomplete(obj, survey_string, i);
            }
            //------------------------------------------------------ 
            // radio button       
            //------------------------------------------------------            
            if (obj.type == "radiobutton") {
                survey_string = this.process_survey_radiobutton(obj, survey_string, i);
            }
            //------------------------------------------------------                  
            // range
            //------------------------------------------------------                 
            if (obj.type == "range") {
                //survey_string = this.process_survey_range(obj, survey_string, i);
            }
            if (obj.type == "range2") {
                //survey_string = this.process_survey_range2(obj, survey_string, i);
            }
            //------------------------------------------------------                  
            //checkbox  
            //------------------------------------------------------                 
            if (obj.type == "checkbox") {
                //survey_string = this.process_survey_checkbox(obj, survey_string, i);
            }
            survey_string = survey_string + '</div>';
        }
        return survey_string;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DynamicSurveyComponent.prototype, "fileLink", void 0);
    tslib_1.__decorate([
        ViewChild('vc', { read: ViewContainerRef, static: false }),
        tslib_1.__metadata("design:type", ViewContainerRef)
    ], DynamicSurveyComponent.prototype, "vc", void 0);
    DynamicSurveyComponent = tslib_1.__decorate([
        Component({
            selector: 'app-dynamic-survey',
            templateUrl: './dynamic-survey.component.html',
            styleUrls: ['./dynamic-survey.component.scss']
        })
        //@PreLoad('life-insights')
        ,
        tslib_1.__metadata("design:paramtypes", [Compiler,
            Injector,
            NgModuleRef,
            AwsS3Service,
            EncrDecrService,
            Router,
            GoogleAnalytics,
            ChangeDetectorRef,
            AppVersion,
            AlertController,
            Platform,
            UserProfileService,
            AwardDollarService])
    ], DynamicSurveyComponent);
    return DynamicSurveyComponent;
}());
export { DynamicSurveyComponent };
//# sourceMappingURL=dynamic-survey.component.js.map