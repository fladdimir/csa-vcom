import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Icon,
  IconOptions,
  latLng,
  LatLng,
  LatLngExpression,
  LeafletEvent,
  Marker,
  MarkerOptions,
  Point,
  Polyline,
  PolylineOptions,
  tileLayer,
} from 'leaflet';
import { sha1 } from 'object-hash';
import { Customer } from '../locations/customers/customer';
import { CustomerService } from '../locations/customers/customers.service';
import { Depot } from '../locations/depots/depot';
import { DepotService } from '../locations/depots/depots.service';
import { Location } from '../locations/location';
import { TourLocations } from '../tours/tour';
import { ToursComponent } from '../tours/tours.component';
import { TourService } from '../tours/tours.service';
import { Truck } from '../trucks-overview/trucks-list/truck';
import { TruckService } from '../trucks-overview/trucks-list/trucks.service';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { OsrmRouteService } from './osrm-route.service';

@Component({
  selector: 'app-tour-planning',
  templateUrl: './tour-planning.component.html',
  styleUrls: ['./tour-planning.component.css'],
})
export class TourPlanningComponent implements OnInit {
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }),
    ],
    zoom: 11,
    center: latLng(53.58, 10),
    zoomControl: false,
    attributionControl: false,
  };

  layers = [];

  requestOsrmRoutes = true;

  constructor(
    public dialog: MatDialog,
    private zone: NgZone,
    private truckService: TruckService,
    private customerService: CustomerService,
    private depotService: DepotService,
    private tourService: TourService,
    private osrmRouteService: OsrmRouteService
  ) {}

  ngOnInit(): void {
    this.layers = [];
    this.load_depots();
    this.load_customers();
    this.load_tours();
  }

  toHexColor(obj: any): string {
    return '#' + sha1(obj).substr(0, 6);
  }

  recalculatePendingTours(): void {
    this.tourService.recalculatePendingTours().subscribe(
      (res) => {
        alert(JSON.stringify(res, undefined, 4));
        this.ngOnInit();
      },
      (error) =>
        alert(
          'recalculation of pending tours failed with error:\n' +
            JSON.stringify(error, undefined, 4)
        )
    );
  }

  load_tours(): void {
    this.tourService
      .findAllTourLocations()
      .subscribe((tours) => tours.forEach((tour) => this.process_tour(tour)));
  }

  process_tour(tour: TourLocations): void {
    const numPendingOrders = tour.order_set.filter((o) => !o.is_delivered)
      .length;
    if (numPendingOrders === 0) {
      return; // finished tour
    }
    const percFinished =
      ((tour.order_set.length - numPendingOrders) / tour.order_set.length) *
      100;

    const locations: Location[] = tour.order_set
      .sort((a, b) => (a.rank > b.rank ? 1 : -1))
      .map((order) => order.customer.location);
    locations.unshift(tour.depot.location); // start
    locations.push(tour.depot.location); // end

    if (this.requestOsrmRoutes) {
      this.osrmRouteService.retrieveRoute(locations).subscribe(
        (osrmRoute) => {
          if (osrmRoute.code != 'Ok') {
            console.log(
              `osrm request failed: {locations.toString()} with code: {osrmRoute.code}`
            );
            this.displaySimplePolyline(locations, tour, percFinished);
          }
          const latlngs = osrmRoute.routes[0].geometry.coordinates.map(
            (coordPair) => new LatLng(coordPair[1], coordPair[0])
          );
          this.displayPolyline(latlngs, tour, percFinished);
        },
        (error) => this.displaySimplePolyline(locations, tour, percFinished)
      );
    } else {
      this.displaySimplePolyline(locations, tour, percFinished);
    }
  }

  displaySimplePolyline(
    locations: Location[],
    tour: TourLocations,
    percFinished: number
  ): void {
    const latlngs = locations.map((loc) => new LatLng(loc.lat, loc.lon));
    this.displayPolyline(latlngs, tour, percFinished);
  }

  displayPolyline(
    latlngs: LatLngExpression[],
    tour: TourLocations,
    percFinished: number
  ): void {
    const options: PolylineOptions = {
      color: this.toHexColor(tour.id),
      opacity: 0.6,
      weight: 5,
    };
    const polyline: Polyline = new Polyline(latlngs, options);
    let tooltip = `Tour ${tour.id}: ${percFinished}%`;
    tooltip = tour.truck ? tooltip + ` - Truck ID: ${tour.truck.id}` : tooltip;
    polyline.bindTooltip(tooltip);
    this.layers.push(polyline);
    const context: TourLocationsClickContext = {
      component: this,
      clicked: tour,
    };
    polyline.addEventListener('click', this.onTourClick, context);
  }

  onTourClick(e: LeafletEvent): void {
    const context: TourLocationsClickContext = (this as unknown) as TourLocationsClickContext;
    context.component.zone.run(() =>
      context.component.openTourDetailModal(context.clicked)
    );
  }

  openTourDetailModal(tour: TourLocations) {
    const dialog = this.dialog.open(ToursComponent, {
      width: '50%',
      data: tour,
    });
    dialog.beforeClosed().subscribe(() => {
      if (dialog.componentInstance.changeHappened) {
        this.ngOnInit();
      }
    });
  }

  // -------------- depots -------------------

  load_depots(): void {
    this.depotService
      .findAll()
      .subscribe((depots) =>
        depots.forEach((depot) => this.process_depot(depot))
      );
  }

  process_depot(depot: Depot): void {
    const icon = this.create_icon(
      'assets/icons/business.png',
      new Point(36, 36),
      new Point(18, 30),
      null
    );
    const title = 'Depot ' + depot.id.toString() + ' - ' + depot.name;
    const marker = this.add_marker(icon, title);
    marker.setLatLng(latLng(depot.location.lat, depot.location.lon));
  }

  load_customers(): void {
    this.customerService
      .findAll()
      .subscribe((customers) =>
        customers.forEach((customer) => this.process_customer(customer))
      );
  }

  process_customer(customer: Customer): void {
    const numPendingOrders = customer.order_set.filter((o) => !o.is_delivered)
      .length;

    const icon = this.create_icon(
      'assets/icons/person_pin.png',
      new Point(36, 36),
      new Point(18, 30),
      undefined,
      undefined,
      new Point(13, 37)
    );
    const title = `Customer ${customer.id} - ${customer.name}\n# pending orders: ${numPendingOrders}`;
    const marker = this.add_marker(icon, title);
    marker.setLatLng(latLng(customer.location.lat, customer.location.lon));
    const context: CustomerClickContext = {
      component: this,
      clicked: customer,
    };
    marker.addEventListener('click', this.onCustomerClick, context);
  }

  onCustomerClick(e: LeafletEvent): void {
    const context: CustomerClickContext = (this as unknown) as CustomerClickContext;
    context.component.zone.run(() =>
      context.component.openCustomerDetailModal(context.clicked.id)
    );
  }

  openCustomerDetailModal(customerId: number) {
    const dialogRef = this.dialog.open(CustomerDetailComponent, {
      width: '50%',
      data: { customerId },
    });
    dialogRef.beforeClosed().subscribe(() => this.ngOnInit());
  }

  add_marker(icon: Icon, title = ''): Marker {
    const options: MarkerOptions = {
      icon,
      title,
    };
    const marker = new Marker(latLng(0, 0), options);
    this.layers.push(marker);
    return marker;
  }

  create_icon(
    iconUrl = 'assets/marker-icon.png',
    iconSize = new Point(25, 41),
    iconAnchor = new Point(12, 41),
    shadowUrl = 'assets/marker-shadow.png',
    shadowSize = new Point(41, 41),
    shadowAnchor = new Point(12, 41)
  ): Icon {
    const iconOptions: IconOptions = {
      iconUrl,
      iconSize,
      iconAnchor,
      shadowUrl,
      shadowSize,
      shadowAnchor,
    };
    return new Icon(iconOptions);
  }
}

interface TourLocationsClickContext
  extends ClickContext<TourPlanningComponent, TourLocations> {}

interface CustomerClickContext
  extends ClickContext<TourPlanningComponent, Customer> {}

export interface ClickContext<ContainerComponent, ClickedObject> {
  component: ContainerComponent;
  clicked: ClickedObject;
}
