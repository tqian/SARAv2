import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-q1-motivated',
  templateUrl: './q1-motivated.component.html',
  styleUrls: ['./q1-motivated.component.scss'],
})
export class Q1MotivatedComponent implements OnInit {

  @ViewChild('lineCanvas') lineCanvas: ElementRef<HTMLDivElement>;
  
  questions;
  qimgs;
  lifeInsightsTitle;
  qYaxis;
  qSubText;
  lifeInsightsHighStress;
  lifeInsightsLowStress;

  imgloc;
  title;
  subtext;
  bottomSubtext;
  topSubtext;
  label;
  data;
  options;

  private lineChart: Chart;

  constructor() { 
          //
          this.questions = ["Q1d","Q3d","Q4d","Q5d","Q6d"];// ,"Q7d"];
          this.qimgs = ["assets/img/stress.png","assets/img/freetime.png","assets/img/dance2.png","assets/img/social.png","assets/img/exciting.png"];
          this.lifeInsightsTitle = ["How <b>relaxed</b> did you feel this week?", 
                      "How much <b>free time</b> did you have this week?", 
                      "How much <b>fun</b> did you have this week?  <i class='em em-tada'></i>", 
                      "How <b>lonely</b> did you feel this week?", 
                      "How <b>new</b> and <b>exciting</b> was your week?"];

          this.qYaxis = ["Stress level","Hours free","Level of fun","Degree of loneliness","Level of exicitement"];        
          this.qSubText = ["0 = low stress, 4 = high stress", 
                          "Hours of free time everyday",
                          "0 = low fun, 4 = a lot of fun",
                          "0 = very social, 4 = very lonely",
                          "0 = low excitment, 4 = very exciting"];   

          this.lifeInsightsHighStress = ["Stressed <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>", 
                                          "15 hours <i class='em em-clock10'></i>", 
                                          "day was fun <i class='em em-balloon'></i>", 
                                          "day was like <i class='em em-person_frowning'></i", 
                                          "day was like <i class='em em-fire'></i><i class='em em-dancers'></i><i class='em em-palm_tree'></i>"];

          this.lifeInsightsLowStress = ["Relaxed <i class='em em-sunglasses'></i><i class='em em-boat'></i>", 
                                          "0 hour <i class='em em-clock12'></i>", 
                                          "day was lame  <i class='em em--1'></i>", 
                                          "day was like <i class='em em-two_women_holding_hands'>", 
                                          "day was like <i class='em em-zzz'></i>"];

          
  }

  

  ngOnInit() {
    this.imgloc = this.qimgs[0];
    this.title = this.lifeInsightsTitle[0];
    this.subtext = this.qSubText[0];
    this.topSubtext = this.lifeInsightsHighStress[0];
    this.bottomSubtext = this.lifeInsightsLowStress[0];
    this.label = this.questions[0];

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels: ["9/13", "9/14", "9/15", "9/16", "9/17", "9/18", "Today"], //x-label
        datasets: [
          {
            label: "My First dataset",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "rgba(75,192,192,1)",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: [0, 1, 3, 4, null, 3, 1], //y-label
            spanGaps: false
          }
        ]
      },
      options: {
        tooltips: {enabled: false},
        hover: {mode: null},
        legend: {
            display: false
        },
        maintainAspectRatio: false,
        layout: {
          padding: {
              left: 5,
              right: 5,
              top: 15,
              bottom: 5
          }
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'probability',
              fontColor: "#000"
            },
            ticks: {
              max: 4,
              min: 0,
              stepSize: 1,
              display: true
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'hola',
              fontColor: "#000"
            }
          }],
        }
      }
    });
  }


  /*
  {
    this.options = {
      chart: {
        type: 'lineChart',
        useInteractiveGuideline: true,
        height: 450,
        transitionDuration: 350,
        showLegend: false,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: (d) => { return d.x; },
        y: (d) => { return d.y; },
        xScale: d3.time.scale(),
        xAxis: {
          ticks: d3.time.months,
          tickFormat: (d) => {
              return d3.time.format('%b')(new Date(d));
          }
        },
        yAxis: {
          axisLabel: 'Gross volume',
          tickFormat: (d) => {
              if (d == null) {
                  return 0;
              }
              return d3.format('.02f')(d);
          },
          axisLabelDistance: 400
        }
      }
    }

    this.data = [
      {
        key: "Cumulative Return",
        values: [
          {
            "label" : "A" ,
            "value" : -29.765957771107
          } ,
          {
            "label" : "B" ,
            "value" : 0
          } ,
          {
            "label" : "C" ,
            "value" : 32.807804682612
          } ,
        ]
      }
    ];
  }
  */

}
