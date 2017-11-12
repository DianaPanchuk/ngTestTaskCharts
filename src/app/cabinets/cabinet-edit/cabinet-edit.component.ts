import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CabinetsService } from '../cabinets.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-cabinet-edit',
  templateUrl: './cabinet-edit.component.html',
  styleUrls: ['./cabinet-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CabinetEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  cabinetForm: FormGroup;

  routeSubscription: Subscription;
  formSubscription: Subscription;

  datesIsValid = true;

  constructor(private route: ActivatedRoute,
              private cabinetService: CabinetsService,
              private router: Router) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.params
      .subscribe(
        (params: Params) => {

          if (params['id']) {
            this.editMode = true;
            this.id = +params['id'];
            // this.editMode = params['id'] != null;
          } else {
            this.editMode = false;
          }

          this.initForm();
        }
      );
  }

  private initForm() {
    let cabinetDays = new FormArray([]),
      color = '';
    if (this.editMode) {
      const cabinet = this.cabinetService.getCabinet(this.id);
      color = cabinet.color;

      if (cabinet['days']) {
        for (const day of cabinet.days) {
          cabinetDays.push(
            new FormGroup({
              'date': new FormControl(day.date, [Validators.required]),
              'amount': new FormControl(day.amount, [
                Validators.required,
                Validators.pattern(/^[0-9]\d*$/)
              ])
            })
          );
        }
      }
    }

    this.cabinetForm = new FormGroup({
      'color': new FormControl(color),
      'days': cabinetDays
    });

    this.formSubscription = this.cabinetForm.valueChanges.subscribe(
      () => {
        this.validateDates();
      });

  }

  onAddDay() {
    (<FormArray>this.cabinetForm.get('days')).push(
      new FormGroup({
        'date': new FormControl(new Date(), [Validators.required]),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      })
    );
  }

  onDeleteDay(index: number) {
    (<FormArray>this.cabinetForm.get('days')).removeAt(index);
    this.validateDates();
  }

  onSubmit() {
    if (this.editMode) {
      this.cabinetService.updateCabinet(this.id, this.cabinetForm.value);
    } else {
      this.cabinetService.addCabinet(this.cabinetForm.value);
      this.router.navigate(['/cabinets', this.cabinetService.getCabinetsCount() - 1, 'edit']);
    }
  }

  validateDates() {
    if (this.cabinetForm) {
      var dates = [], dublicates = [],
        controls = this.cabinetForm.get('days')['controls'];

      controls.forEach((el) => {
        dates.push(el.value.date.setHours(0, 0, 0, 0));
      });

      dublicates = _.filter(dates, v => _.filter(dates, v1 => v1 === v).length > 1);

      if (dublicates.length) {
        this.datesIsValid = false;
      } else {
        this.datesIsValid = true;
      }
    }

  }

  onDeleteCabitent() {
    this.cabinetService.deleteCabinet(this.id);
    this.router.navigate(['/cabinets']);
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
