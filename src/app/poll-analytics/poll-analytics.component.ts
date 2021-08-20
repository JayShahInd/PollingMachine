import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { Poll } from '../shared/models/poll';
import { Vote } from '../shared/models/Votes';
import { PollService } from '../shared/services/poll.service';

@Component({
  selector: 'app-poll-analytics',
  templateUrl: './poll-analytics.component.html',
  styleUrls: ['./poll-analytics.component.scss']
})
export class PollAnalyticsComponent implements OnInit {

  pollData: Vote[] = [];
  activePoll: Poll;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0
          }
        }
      ]
    }
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Answers' },
  ];
  public chartColors: Array<any> = [{ backgroundColor: ['#47B39C', '#FFC154', '#E6F69D', '#EC6B56', '#AADEA7', '#2D87BB'], borderColor: 'transparent' }];
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private pollService: PollService) { }
  
  ngOnInit(): void {
    this.pollService.events$.forEach(event => {
      switch (event) {
        case "PollCreated":
          this.initPollChart();
          break;
        case "PollUpdated":
        case "VoteCasted":
          this.updatePollChart();
          break;
        case "Reset":
          this.resetChart();
          break;
        default:
          break;
      };
    });

    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  initPollChart() {
    this.resetData();
    this.activePoll = this.pollService.get();
    this.activePoll.options.forEach(item => {
      var tempItem = JSON.parse(JSON.stringify(item));
      this.pieChartLabels.push(tempItem.Value);
      this.pieChartData.push(0);
      this.barChartLabels.push(tempItem.Value);
      this.barChartData[0].data.push(0);
    });
  }

  updatePollChart() {
    this.resetData();
    this.pollData = this.pollService.getResult();
    this.pollData.forEach(item => {
        this.pieChartData.push(item.count);
        this.barChartData[0].data.push(item.count);
        this.pieChartLabels.push(item.answer);
        this.barChartLabels.push(item.answer);
    });
  }

  resetChart() {
    this.resetData();
    this.pollData = [];
    this.activePoll = undefined;
  }

  resetData() {
    this.pieChartLabels = [];
    this.barChartLabels = [];
    this.pieChartData = [];
    this.barChartData[0].data = [];
  }

}
