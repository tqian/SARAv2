import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-q1-motivated',
  templateUrl: './q1-motivated.component.html',
  styleUrls: ['./q1-motivated.component.scss'],
})
export class Q1MotivatedComponent implements OnInit {

  @ViewChild('lineCanvas') lineCanvas: ElementRef<HTMLDivElement>;
  //@Input() inputStr : string;
  @Input() jsonObj : any;

  //jsonObj;

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
  }

  

  ngOnInit(){

    //console.log(this.inputStr);
    //this.jsonObj = JSON.parse(this.inputStr);
    //console.log("Q1MotivatedComponent "+JSON.stringify(this.jsonObj));
    this.imgloc = this.jsonObj.imgloc;
    this.title = this.jsonObj.title;
    this.subtext = this.jsonObj.subtext;
    this.topSubtext = this.jsonObj.topSubtext;
    this.bottomSubtext = this.jsonObj.bottomSubtext;
    this.label = this.jsonObj.label;
    this.data = this.jsonObj.data;  


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
            data: this.data, //y-label
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