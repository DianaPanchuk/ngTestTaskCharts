import { Component, OnInit } from '@angular/core';
import { CabinetsService } from '../cabinets.service';

@Component({
  selector: 'app-cabinet-list',
  templateUrl: './cabinet-list.component.html',
  styleUrls: ['./cabinet-list.component.css']
})
export class CabinetListComponent implements OnInit {

  cabinets;

  constructor( private cabinetsService: CabinetsService ) { }

  ngOnInit() {
    this.cabinets = this.cabinetsService.getCabinets();
  }

}
