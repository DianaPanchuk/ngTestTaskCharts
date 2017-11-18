import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import { CabinetsService } from '../cabinets/cabinets.service';
import { Observable } from 'rxjs/Observable';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StatsComponent implements OnInit {
  cabinets;
  statsForm: FormGroup;

  @ViewChild('mainChart') mainChart: BaseChartDirective;

  constructor(private cabinetsService: CabinetsService) {}

  datepickerOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    firstCalendarDay: 0 // 0 - Sunday, 1 - Monday
  };

  data = {
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
    colors: [],
    labels: [],
    datasets: []
  };

  ngOnInit() {
    this.cabinets = this.cabinetsService.getCabinets();
    this.initFilter();
    this.getStatsData();
  }

  initFilter() {
    let dates = [];
    this.cabinets.forEach((cabinet) => {
      cabinet.days.forEach((el) => {
        dates.push(el.date);
      });
    });

    let cabinetsList = new FormArray([]);
    this.cabinets.forEach(() => {
      cabinetsList.push(
        new FormControl(false)
      );
    });

    this.statsForm = new FormGroup({
      dateFrom: new FormControl(_.min(dates)),
      dateTo: new FormControl(_.max(dates)),
      cabinets: cabinetsList
    });

    this.statsForm.valueChanges.subscribe(
      () => {
        this.getStatsData();
      });
  }

  getStatsData() {
    let dates = [],
        values = [];

    // get unique dates
    this.cabinets.forEach((cabinet) => {
      cabinet.days.forEach((day) => {
        if (day.date.getTime() >= this.statsForm.get('dateFrom').value.getTime() &&
          day.date.getTime() <= this.statsForm.get('dateTo').value.getTime()) {
          dates.push(day.date);
        }
      });
    });

    let uniqueDatesUnformated = [],
      uniqueDates = dates
        .map(date => date.toString())
        .filter((date, index, a) => a.indexOf(date) === index)
        .map(date => {
          let uniqueDate = new Date(date);
          uniqueDatesUnformated.push(uniqueDate);
          return `${uniqueDate.getDate()}/${uniqueDate.getMonth() + 1 }/${uniqueDate.getFullYear()}`;
        });

    // find amount of visits for all dates
    let selectedCabinets = this.statsForm.get('cabinets').value,
        skipCheck = selectedCabinets.every(elem => elem === false) || selectedCabinets.every(elem => elem === true);

    this.cabinets.forEach((cabinet, index) => {
      const color = cabinet.color;
      this.data.colors.push(color);
      let item = {
          label: `Cabinet ${index}`,
          fill: false,
          lineTension: 0,
          borderWidth: 1.5,
          pointBorderWidth: 1,
          backgroundColor: color,
          borderColor: color,
          pointBackgroundColor: 'white',
          data: []
        };
      uniqueDatesUnformated.forEach((cabinetItem) => {
        let count = cabinet.days.find((day) => {
          if ( day.date.getTime()  === cabinetItem.getTime() ) {
            return day.amount;
          }
        });
        if (count) {
          item.data.push(count.amount);
        } else {
          item.data.push(0);
        }
      });
      if (skipCheck || !skipCheck && selectedCabinets[index]) {
        values.push(item);
      }
    });

    this.data.labels = uniqueDates;
    this.data.datasets = values;
    this.update(uniqueDates, values);
  }

  update(labels, dataset) {
    if (this.mainChart && this.mainChart.chart && this.mainChart.chart.config) {
      this.mainChart.chart.config.data.labels = labels;
      this.mainChart.chart.config.data.datasets = dataset;
      this.mainChart.chart.config.data.options = this.data.options;
      this.mainChart.chart.update();
    }
  }
}
