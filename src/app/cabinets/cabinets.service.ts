import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class CabinetsService {
  private cabinetsRetrieved = false;
  private cabinets = [
    /*{
      color: 'rgba(54, 162, 235, 1)',
      days: [
        {date: new Date('10/9/2017'), amount: 10},
        {date: new Date('10/8/2017'), amount: 11},
        {date: new Date('10/7/2017'), amount: 12}
      ]
    },
    {
      color: 'rgba(255, 206, 86, 1)',
      days: [
        {date: new Date('10/8/2017'), amount: 5},
        {date: new Date('10/7/2017'), amount: 6},
        {date: new Date('10/6/2017'), amount: 7}
      ]
    },
      {
        color: 'rgba(75, 192, 192, 1)',
        days: [
        {date: new Date('10/7/2017'), amount: 9},
        {date: new Date('10/6/2017'), amount: 8},
        {date: new Date('10/5/2017'), amount: 7}
      ]
    }*/
  ];

  constructor(private storage: LocalStorageService) { }

  retrieveCabitents() {
    const data = this.storage.retrieve('cabinets');
    if (data) {
      data.map((cabinet) => {
        cabinet.days.map((day) => {
          day.date = new Date(day.date);
        });
      });
      this.cabinets = data;
    }
    this.cabinetsRetrieved = true;
  }
  storeCabitents() {
    this.storage.store('cabinets', this.cabinets);
  }

  getCabinets() {
    if (!this.cabinetsRetrieved) {
      this.retrieveCabitents();
    }
    return this.cabinets;
  }

  getCabinet(id: number) {
    return this.cabinets[id];
  }

  addCabinet(cabinetData) {
    cabinetData.color = this.getRandomColor();
    this.cabinets.push(cabinetData);
    this.storeCabitents();
  }

  updateCabinet(index: number, newCabinet) {
    this.cabinets[index] = newCabinet;
    this.storeCabitents();
  }

  getCabinetsCount() {
    return this.cabinets.length;
  }
  deleteCabinet(index: number) {
    this.cabinets.splice(index, 1);
    this.storeCabitents();
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
