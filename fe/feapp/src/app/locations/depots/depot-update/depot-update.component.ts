import { Component, OnInit, Inject } from '@angular/core';
import { Depot } from '../depot';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepotService } from '../depots.service';

@Component({
  selector: 'app-depot-update',
  templateUrl: './depot-update.component.html',
  styleUrls: ['./depot-update.component.css'],
})
export class DepotUpdateComponent implements OnInit {
  depot: Depot;
  constructor(
    public dialogRef: MatDialogRef<DepotUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) depotArg: Depot,
    private depotService: DepotService
  ) {
    this.depot = depotArg;
  }

  ngOnInit(): void {}

  onUpdate(): void {
    this.depotService.update(this.depot).subscribe(
      () => this.dialogRef.close(true),
      (error) => alert('Depot update failed:\n' + JSON.stringify(error))
    );
  }

  onDelete(): void {
    this.depotService.delete(this.depot).subscribe(
      () => this.dialogRef.close(true),
      (error) => alert('Depot update failed:\n' + JSON.stringify(error))
    );
  }
}
