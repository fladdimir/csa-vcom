import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrucksComponent } from './trucks-overview/trucks-list/trucks.component';
import { AngularMaterialModule } from './util/materialmodule';
import { CustomersComponent } from './locations/customers/customers.component';
import { OrdersComponent } from './orders/orders.component';
import { ToursComponent } from './tours/tours.component';
import { TourPlanningComponent } from './tour-planning/tour-planning.component';
import { LocationsComponent } from './locations/locations.component';
import { DepotsComponent } from './locations/depots/depots.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CustomerDetailComponent } from './tour-planning/customer-detail/customer-detail.component';
import { OrdercreationComponent } from './orders/ordercreation/ordercreation.component';
import { LocationsMapComponent } from './locations/locations-map/locations-map.component';
import { CustomerCreationFormComponent } from './locations/customers/customer-creation-form/customer-creation-form.component';
import { CustomerUpdateComponent } from './locations/customers/customer-update/customer-update.component';
import { StartComponent } from './start/start.component';
import { DepotCreationFormComponent } from './locations/depots/depot-creation-form/depot-creation-form.component';
import { DepotUpdateComponent } from './locations/depots/depot-update/depot-update.component';
import { TrucksMapComponent } from './trucks-overview/trucks-map/trucks-map.component';
import { TrucksOverviewComponent } from './trucks-overview/trucks-overview.component';
import { TrucksCreationFormComponent } from './trucks-overview/trucks-list/trucks-creation-form/trucks-creation-form.component';

@NgModule({
  declarations: [
    AppComponent,
    TrucksComponent,
    CustomersComponent,
    OrdersComponent,
    ToursComponent,
    TourPlanningComponent,
    LocationsComponent,
    DepotsComponent,
    CustomerDetailComponent,
    OrdercreationComponent,
    LocationsMapComponent,
    CustomerCreationFormComponent,
    CustomerUpdateComponent,
    StartComponent,
    DepotCreationFormComponent,
    DepotUpdateComponent,
    TrucksMapComponent,
    TrucksOverviewComponent,
    TrucksCreationFormComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    LeafletModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
