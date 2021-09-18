import { Component, OnInit } from '@angular/core';
import { Truck } from '../truck';
import { TruckService } from '../trucks.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-trucks-creation-form',
  templateUrl: './trucks-creation-form.component.html',
  styleUrls: ['./trucks-creation-form.component.css'],
})
export class TrucksCreationFormComponent implements OnInit {
  truck = new Truck();

  constructor(
    public dialogRef: MatDialogRef<TrucksCreationFormComponent>,
    private truckService: TruckService
  ) {}

  ngOnInit(): void {}

  onConfirm(): void {
    console.log('h');
    this.truckService.create(this.truck).subscribe(
      (createdTruck) => this.dialogRef.close(createdTruck),
      (error) =>
        alert(
          'Error while creating new Truck-Entity:\n' + JSON.stringify(error)
        )
    );
  }
}
