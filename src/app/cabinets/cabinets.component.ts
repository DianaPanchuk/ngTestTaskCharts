import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cabinets',
  templateUrl: './cabinets.component.html',
  styleUrls: ['./cabinets.component.css']
})
export class CabinetsComponent implements OnInit {
  cabinets = [];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {}

  addCabinet() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
