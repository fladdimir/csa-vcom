import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Truck } from './truck';
import { TruckService } from './trucks.service';
import { MatDialog } from '@angular/material/dialog';
import { TrucksCreationFormComponent } from './trucks-creation-form/trucks-creation-form.component';

@Component({
  selector: 'app-trucks',
  templateUrl: './trucks.component.html',
  styleUrls: ['./trucks.component.css'],
})
export class TrucksComponent implements OnInit {
  trucks: Observable<Truck[]>;

  @Output() truckChange: EventEmitter<Truck> = new EventEmitter<Truck>();

  displayedColumns: string[] = [
    'id',
    'name',
    'capacity',
    'lat',
    'lon',
    'tour',
    'delete',
  ];

  constructor(private truckService: TruckService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.trucks = this.truckService.findAll();
  }

  addTruck(): void {
    const dialogRef = this.dialog.open(TrucksCreationFormComponent, {
      width: '30%',
    });
    dialogRef.beforeClosed().subscribe((createdTruck: Truck) => {
      if (createdTruck) {
        this.truckChange.emit(createdTruck);
        this.ngOnInit();
      }
    });
  }

  updateName(truck: Truck): void {
    this.truckService.update(truck).subscribe(
      () => this.truckChange.emit(truck),
      (error) => alert('Error while updating truck: ' + JSON.stringify(error))
    );
  }

  deleteTruck(truck: Truck): void {
    this.truckService.delete(truck).subscribe(
      () => {
        this.truckChange.emit(truck);
        this.ngOnInit();
      },
      (error) => alert('Error while deleting truck: ' + JSON.stringify(error))
    );
  }
}
