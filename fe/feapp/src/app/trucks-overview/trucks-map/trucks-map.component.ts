import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
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
  tileLayer
} from 'leaflet';
import { sha1 } from 'object-hash';
import { Customer } from 'src/app/locations/customers/customer';
import { Depot } from 'src/app/locations/depots/depot';
import { Location } from 'src/app/locations/location';
import { OrderWithCustomer } from 'src/app/orders/order';
import { OsrmRouteService } from 'src/app/tour-planning/osrm-route.service';
import { ClickContext } from 'src/app/tour-planning/tour-planning.component';
import { TourLocations } from 'src/app/tours/tour';
import { ToursComponent } from 'src/app/tours/tours.component';
import { TourService } from 'src/app/tours/tours.service';
import { Truck } from '../trucks-list/truck';
import { TruckService } from '../trucks-list/trucks.service';

@Component({
  selector: 'app-trucks-map',
  templateUrl: './trucks-map.component.html',
  styleUrls: ['./trucks-map.component.css'],
})
export class TrucksMapComponent implements OnInit {
  @Output() truckChange: EventEmitter<Truck> = new EventEmitter<Truck>();

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

  constructor(
    private truckService: TruckService,
    private zone: NgZone,
    private tourService: TourService,
    private osrmRouteService: OsrmRouteService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initialize_map();
    this.schedule_refresh();
  }

  async schedule_refresh() {
    while (true) {
      await new Promise(r => setTimeout(r, 2500));
      this.initialize_map();
    }
  }

  initialize_map(): void {
    this.layers = [];
    this.load_trucks();
  }

  toHexColor(obj: any): string {
    return '#' + sha1(obj).substr(0, 6);
  }

  assignToursToIdleTrucks(): void {
    this.tourService.matchTrucksAndTours().subscribe(
      (res) => {
        alert('tours assigned: ' + JSON.stringify(res, undefined, 4));
        this.initialize_map();
      },
      (error) =>
        alert(
          'tour assignment failed with error: ' +
          JSON.stringify(error, undefined, 4)
        )
    );
  }

  load_trucks(): void {
    // incl. websocket for change notification? -> move truck markers, reload tour status
    this.truckService
      .findAll()
      .subscribe((trucks) =>
        trucks.forEach((truck) => this.processTruck(truck))
      );
  }

  processTruck(truck: Truck): void {
    const icon_path = truck.tour ? 'bus_front.png' : 'bus_front_white.png';
    const icon = this.create_icon(
      'assets/icons/' + icon_path,
      new Point(36, 36),
      new Point(18, 18),
      null
    );
    let title = `Truck ${truck.id} - ${truck.name}`;
    title = truck.tour ? title + `\nTour ID: ${truck.tour}` : title;
    const marker = this.add_marker(icon, title, true);
    marker.setLatLng(latLng(truck.lat, truck.lon));

    const dropContext: TrucksMapComponentDropContext = {
      component: this,
      clicked: truck,
      marker: marker,
    };

    marker.addEventListener('dragend', this.onTruckMarkerDrop, dropContext);

    if (truck.tour) {
      this.loadTourLocations(truck.tour);
    }
  }

  loadTourLocations(tourId: number): void {
    this.tourService
      .findTourLocations(tourId)
      .subscribe((tour) => this.processTour(tour));
  }

  processTour(tour: TourLocations): void {
    this.addDepot(tour.depot);
    const orders: OrderWithCustomer[] = tour.order_set.sort(
      (a, b) => a.rank - b.rank
    );
    const relevantOrders: OrderWithCustomer[] = [];
    for (let index = 0; index < orders.length - 1; index++) {
      const prev = orders[index];
      const next = orders[index + 1];
      if (!next.is_delivered) {
        relevantOrders.push(prev);
      }
    }
    relevantOrders.push(orders[orders.length - 1]);
    const distinctCustomers = [
      ...new Set(relevantOrders.map((o) => o.customer)),
    ];
    distinctCustomers.forEach((c) => this.addCustomer(c));
    const locations = distinctCustomers.map((c) => c.location);
    if (!orders[0].is_delivered) {
      locations.unshift(tour.depot.location); // start
    }
    locations.push(tour.depot.location); // end
    this.addTour(locations.slice(0, 2), tour, 0.9); // first leg
    this.addTour(locations.slice(1, locations.length), tour, 0.5);
  }

  addTour(locations: Location[], tour: TourLocations, opacity = 0.4): void {
    this.osrmRouteService.retrieveRoute(locations).subscribe(
      (osrmRoute) => {
        if (osrmRoute.code != 'Ok') {
          console.log(
            `osrm request failed: ${locations.toString()} with code: ${osrmRoute.code
            }`
          );
          this.displaySimplePolyline(locations, tour, opacity);
        }
        const latlngs = osrmRoute.routes[0].geometry.coordinates.map(
          (coordPair) => new LatLng(coordPair[1], coordPair[0])
        );
        this.displayPolyline(latlngs, tour, opacity);
      },
      (error) => this.displaySimplePolyline(locations, tour, opacity)
    );
  }

  displaySimplePolyline(
    locations: Location[],
    tour: TourLocations,
    opacity = 0.4
  ): void {
    const latlngs = locations.map((loc) => new LatLng(loc.lat, loc.lon));
    this.displayPolyline(latlngs, tour, opacity);
  }

  displayPolyline(
    latlngs: LatLngExpression[],
    tour: TourLocations,
    opacity = 0.4
  ): void {
    const options: PolylineOptions = {
      color: this.toHexColor(tour.id),
      opacity,
      weight: 5,
    };
    const polyline: Polyline = new Polyline(latlngs, options);
    let tooltip = `Tour ${tour.id}`;
    polyline.bindTooltip(tooltip);
    this.layers.push(polyline);

    const context: TourLocationsClickContext = {
      component: this,
      clicked: tour,
    };
    polyline.addEventListener('click', this.onTourClick, context);
  }

  addCustomer(customer: Customer): void {
    const icon = this.create_icon(
      'assets/icons/person_pin.png',
      new Point(36, 36),
      new Point(18, 30),
      undefined,
      undefined,
      new Point(13, 37)
    );
    const title = `Customer ${customer.id} - ${customer.name}`;
    const marker = this.add_marker(icon, title);
    marker.setLatLng(latLng(customer.location.lat, customer.location.lon));
  }

  addDepot(depot: Depot): void {
    const icon = this.create_icon(
      'assets/icons/business.png',
      new Point(36, 36),
      new Point(18, 30),
      null
    );
    const title = `Depot ${depot.id} - ${depot.name}`;
    const marker = this.add_marker(icon, title);
    marker.setLatLng(latLng(depot.location.lat, depot.location.lon));
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
        this.initialize_map();
      }
    });
  }

  onTruckMarkerDrop(e: LeafletEvent): void {
    const context: TrucksMapComponentDropContext = (this as unknown) as TrucksMapComponentDropContext;
    const pos = context.marker.getLatLng();
    const truck = context.clicked;
    const comp = context.component;
    truck.lat = pos.lat;
    truck.lon = pos.lng;
    comp.zone.run(() =>
      comp.truckService.update(truck).subscribe(
        () => { },
        (error) => {
          alert(
            'Truck update failed: \n' + JSON.stringify(error, undefined, 4)
          );
          this.initialize_map();
        }
      )
    );
  }

  add_marker(icon: Icon, title = '', draggable = false): Marker {
    const options: MarkerOptions = {
      icon,
      title,
      draggable,
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
  extends ClickContext<TrucksMapComponent, TourLocations> { }

interface TrucksMapComponentDropContext extends TrucksMapComponentClickContext {
  marker: Marker;
}

interface TrucksMapComponentClickContext
  extends ClickContext<TrucksMapComponent, Truck> { }
