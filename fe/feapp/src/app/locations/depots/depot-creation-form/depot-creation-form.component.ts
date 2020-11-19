import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepotService } from '../depots.service';
import { Depot } from '../depot';
import { Location } from '../../location';

@Component({
  selector: 'app-depot-creation-form',
  templateUrl: './depot-creation-form.component.html',
  styleUrls: ['./depot-creation-form.component.css'],
})
export class DepotCreationFormComponent implements OnInit {
  depot = new Depot();

  constructor(
    public dialogRef: MatDialogRef<DepotCreationFormComponent>,
    @Inject(MAT_DIALOG_DATA) private location: Location,
    private depotService: DepotService
  ) {}

  ngOnInit(): void {
    this.depot.location = this.location;
  }

  onConfirm(): void {
    this.depotService.create(this.depot).subscribe(
      (createdDepot) => this.dialogRef.close(createdDepot),
      (error) =>
        alert('depot creation failed:\n' + JSON.stringify(error, undefined, 4))
    );
  }
}
