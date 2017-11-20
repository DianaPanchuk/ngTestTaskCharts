import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { NgDatepickerModule } from 'ng2-datepicker';
import { StatsComponent } from './stats/stats.component';
import { CabinetEditComponent } from './cabinets/cabinet-edit/cabinet-edit.component';
import { CabinetListComponent } from './cabinets/cabinet-list/cabinet-list.component';
import { CabinetsComponent } from './cabinets/cabinets.component';
import { CabinetsService } from './cabinets/cabinets.service';
import { HomeComponent } from './home/home.component';
import { Ng2Webstorage } from 'ngx-webstorage';

@NgModule({
  declarations: [
    AppComponent,
    CabinetEditComponent,
    StatsComponent,
    CabinetListComponent,
    CabinetsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    ChartsModule,
    NgDatepickerModule,
    AppRoutingModule,
    Ng2Webstorage
  ],
  providers: [ CabinetsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
