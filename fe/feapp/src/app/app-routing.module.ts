import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationsComponent } from './locations/locations.component';
import { StartComponent } from './start/start.component';
import { TourPlanningComponent } from './tour-planning/tour-planning.component';
import { TrucksOverviewComponent } from './trucks-overview/trucks-overview.component';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', component: StartComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'orders-and-tours', component: TourPlanningComponent },
  { path: 'trucks', component: TrucksOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
