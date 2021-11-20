import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Icon,
  IconOptions,
  latLng,
  LatLng,
  Map,
  Marker,
  MarkerOptions,
  Point,
  tileLayer,
  LeafletEvent,
} from 'leaflet';
import { CustomerCreationFormComponent } from 'src/app/locations/customers/customer-creation-form/customer-creation-form.component';
import { Customer } from '../customers/customer';
import { CustomerService } from '../customers/customers.service';
import { ClickContext } from 'src/app/tour-planning/tour-planning.component';
import { CustomerUpdateComponent } from '../customers/customer-update/customer-update.component';
import { Depot } from '../depots/depot';
import { DepotCreationFormComponent } from '../depots/depot-creation-form/depot-creation-form.component';
import { DepotService } from '../depots/depots.service';
import { DepotUpdateComponent } from '../depots/depot-update/depot-update.component';

@Component({
  selector: 'app-locations-map',
  templateUrl: './locations-map.component.html',
  styleUrls: ['./locations-map.component.css'],
})
export class LocationsMapComponent implements OnInit {
  map: Map;

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

  mode: string = null;

  constructor(
    public dialog: MatDialog,
    private zone: NgZone,
    private customerService: CustomerService,
    private depotService: DepotService
  ) {}

  ngOnInit(): void {
    this.layers = [];
    this.load_customers();
    this.load_depots();
  }

  leafletMapReady(map: Map): void {
    this.map = map;
  }

  dragStartCustomer(): void {
    this.mode = 'customer';
  }

  dragStartDepot(): void {
    this.mode = 'depot';
  }

  allowDrag(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.handleDropEvent(e);
  }

  dragEnd(): void {
    this.mode = null;
  }

  handleDropEvent(e: DragEvent): void {
    const pos = this.map.mouseEventToLatLng(e);
    if (this.mode === 'customer') {
      this.createCustomer(pos);
    } else if (this.mode === 'depot') {
      this.createDepot(pos);
    }
  }

  createCustomer(pos: LatLng): void {
    const dialogRef = this.dialog.open(CustomerCreationFormComponent, {
      width: '20%',
      data: {
        lat: pos.lat,
        lon: pos.lng,
      },
    });
    dialogRef.beforeClosed().subscribe((createdCustomer: Customer) => {
      if (createdCustomer) {
        this.ngOnInit();
      }
    });
  }

  createDepot(pos: LatLng): void {
    const dialogRef = this.dialog.open(DepotCreationFormComponent, {
      width: '20%',
      data: {
        lat: pos.lat,
        lon: pos.lng,
      },
    });
    dialogRef.beforeClosed().subscribe((createdDepot: Depot) => {
      if (createdDepot) {
        this.ngOnInit();
      }
    });
  }

  // ------------------ customer --------------------

  load_customers(): void {
    this.customerService
      .findAll()
      .subscribe((customers) =>
        customers.forEach((customer) => this.process_customer(customer))
      );
  }

  process_customer(customer: Customer): void {
    const icon = this.create_icon(
      'assets/icons/person_pin.png',
      new Point(36, 36),
      new Point(18, 30),
      undefined,
      undefined,
      new Point(13, 37)
    );
    const title = `Customer ${customer.id} - ${customer.name}\n# Pending orders: ${customer.order_set.filter(o => !o.is_delivered).length}`;
    const marker = this.add_marker(icon, title);
    marker.setLatLng(latLng(customer.location.lat, customer.location.lon));
    const context: CustomerClickContext = {
      component: this,
      clicked: customer,
    };
    marker.addEventListener('click', this.onCustomerClick, context);
    const dropContext: CustomerDropContext = {
      component: this,
      clicked: customer,
      marker: marker,
    };
    marker.addEventListener('dragend', this.onCustomerMarkerDrop, dropContext);
  }

  onCustomerMarkerDrop(e: LeafletEvent): void {
    const context: CustomerDropContext = (this as unknown) as CustomerDropContext;
    const pos = context.marker.getLatLng();
    context.clicked.location = { lat: pos.lat, lon: pos.lng, id: undefined };
    context.component.zone.run(() =>
      context.component.customerService.update(context.clicked).subscribe(
        () => {
          if (
            context.clicked.order_set.filter((o) => !o.is_delivered).length > 0
          ) {
            alert(
              'Location of customer with pending orders changed, a recalculation of tours might be necessary.'
            );
          }
        },
        (error) => {
          alert(
            'Customer location change failed: \n' +
              JSON.stringify(error, undefined, 4)
          );
          context.component.ngOnInit();
        }
      )
    );
  }

  onCustomerClick(e: LeafletEvent): void {
    const context: CustomerClickContext = (this as unknown) as CustomerClickContext;
    context.component.zone.run(() =>
      context.component.openCustomerDetailModal(context.clicked)
    );
  }

  openCustomerDetailModal(customer: Customer) {
    const dialogRef = this.dialog.open(CustomerUpdateComponent, {
      width: '20%',
      data: customer,
    });
    dialogRef.beforeClosed().subscribe((refresh: boolean) => {
      if (refresh) this.ngOnInit();
    });
  }

  // ------------- depot ------------------

  load_depots(): void {
    this.depotService
      .findAll()
      .subscribe((depot) =>
        depot.forEach((depot) => this.process_depot(depot))
      );
  }

  process_depot(depot: Depot): void {
    const icon = this.create_icon(
      'assets/icons/business.png',
      new Point(36, 36),
      new Point(18, 30),
      null
    );
    const title = `Depot ${depot.id} - ${depot.name}`;
    const marker = this.add_marker(icon, title);
    marker.setLatLng(latLng(depot.location.lat, depot.location.lon));
    const context: DepotClickContext = {
      component: this,
      clicked: depot,
    };
    marker.addEventListener('click', this.onDepotClick, context);
    const dropContext: DepotDropContext = {
      component: this,
      clicked: depot,
      marker: marker,
    };
    marker.addEventListener('dragend', this.onDepotMarkerDrop, dropContext);
  }

  onDepotMarkerDrop(e: LeafletEvent): void {
    const context: DepotDropContext = (this as unknown) as DepotDropContext;
    const pos = context.marker.getLatLng();
    context.clicked.location = { lat: pos.lat, lon: pos.lng, id: undefined };
    context.component.zone.run(() =>
      context.component.depotService.update(context.clicked).subscribe(
        () => {
          if (context.clicked.tour_set.length > 0)
            alert(
              'Location of depot with possibly pending tours changed, a recalculation of tours might be necessary.'
            );
        },
        (error) => {
          alert(
            'Depot location change failed: \n' +
              JSON.stringify(error, undefined, 4)
          );
        }
      )
    );
  }

  onDepotClick(e: LeafletEvent): void {
    const context: DepotClickContext = (this as unknown) as DepotClickContext;
    context.component.zone.run(() =>
      context.component.openDepotDetailModal(context.clicked)
    );
  }

  openDepotDetailModal(depot: Depot) {
    const dialogRef = this.dialog.open(DepotUpdateComponent, {
      width: '20%',
      data: depot,
    });
    dialogRef.beforeClosed().subscribe((refresh: boolean) => {
      if (refresh) this.ngOnInit();
    });
  }

  // ---------- general -------------

  add_marker(icon: Icon, title = ''): Marker {
    const options: MarkerOptions = {
      icon,
      title,
      draggable: true,
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

interface CustomerClickContext
  extends LocationsMapComponentClickContext<Customer> {}

interface CustomerDropContext extends CustomerClickContext, DropContext {}

interface DepotClickContext extends LocationsMapComponentClickContext<Depot> {}

interface DepotDropContext extends DepotClickContext, DropContext {}

interface LocationsMapComponentClickContext<T>
  extends ClickContext<LocationsMapComponent, T> {}

interface DropContext {
  marker: Marker;
}
