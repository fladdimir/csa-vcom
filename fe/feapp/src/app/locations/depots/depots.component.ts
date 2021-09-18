import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Depot } from './depot';
import { DepotService } from './depots.service';

@Component({
  selector: 'app-depots',
  templateUrl: './depots.component.html',
  styleUrls: ['./depots.component.css'],
})
export class DepotsComponent implements OnInit {
  depots: Observable<Depot[]>;

  displayedColumns: string[] = ['id', 'name', 'lat', 'lon', 'num_tours'];

  constructor(private Depotservice: DepotService) {}

  ngOnInit(): void {
    this.depots = this.Depotservice.findAll();
  }
}
