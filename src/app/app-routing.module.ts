import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { StatsComponent } from './stats/stats.component';
import { CabinetEditComponent } from './cabinets/cabinet-edit/cabinet-edit.component';
import { CabinetsComponent } from './cabinets/cabinets.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cabinets', component: CabinetsComponent, children: [
    { path: 'new', component: CabinetEditComponent },
    { path: ':id/edit', component: CabinetEditComponent }
  ]},
  { path: 'stats', component: StatsComponent }
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
