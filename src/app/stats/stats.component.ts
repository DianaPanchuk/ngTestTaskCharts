import { Component, OnInit, ViewChild } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import { CabinetsService } from '../cabinets/cabinets.service';
import { Observable } from 'rxjs/Observable';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
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
    this.cabinets.forEach((c, i) => {
      c.days.forEach((el) => {
        dates.push(el.date);
      });
    });

    let cabinetsList = new FormArray([]);
    this.cabinets.forEach((el, i) => {
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
    this.cabinets.forEach((c, i) => {
      c.days.forEach((el) => {
        if (el.date.getTime() >= this.statsForm.get('dateFrom').value.getTime() &&
          el.date.getTime() <= this.statsForm.get('dateTo').value.getTime()) {
          dates.push(el.date);
        }
      });
    });

    let uniqueDatesUnformated = [],
      uniqueDates = dates
      .map(s => s.toString())
      .filter((s, i, a) => a.indexOf(s) === i)
      .map(s => {
        var d = new Date(s);
        uniqueDatesUnformated.push(d);
        return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
      });

    // this.data.labels = uniqueDates;

    // find amount of visits for all dates
    var  selectedCabinets = this.statsForm.get('cabinets').value,
        skipCheck = selectedCabinets.every(elem => elem === false) || selectedCabinets.every(elem => elem === true);

    this.cabinets.forEach((cabinet, index) => {
      const color = cabinet.color;
      this.data.colors.push(color);
      var item = {
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
      uniqueDatesUnformated.forEach((c, i) => {

        var count = cabinet.days.find((d) => {
          if ( d.date.getTime()  === c.getTime() ) {
            return d.amount;
          }
        });

        if (count) {
          item.data.push(count.amount);
        } else {
          item.data.push(0);
        }
      });

      if (!skipCheck && !selectedCabinets[index]) {
      } else {
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
