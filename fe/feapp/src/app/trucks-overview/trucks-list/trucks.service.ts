import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Truck } from './truck';

@Injectable({ providedIn: 'root' })
export class TruckService {
  apiUrl = environment.apiUrl;

  url = this.apiUrl + 'trucks/';

  constructor(private httpClient: HttpClient) {}

  public findAll(): Observable<Truck[]> {
    return this.httpClient.get<Truck[]>(this.url);
  }

  public create(truck: Truck): Observable<Truck> {
    return this.httpClient.post<Truck>(this.url, truck);
  }

  public update(truck: Truck): Observable<Truck> {
    return this.httpClient.put<Truck>(this.getUrlToTruck(truck), truck);
  }

  public delete(truck: Truck): Observable<Truck> {
    return this.httpClient.delete<Truck>(this.getUrlToTruck(truck));
  }

  private getUrlToTruck(truck: Truck): string {
    return this.url + truck.id + '/';
  }
}
