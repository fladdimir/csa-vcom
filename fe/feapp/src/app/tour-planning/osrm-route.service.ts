import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OsrmRoute } from './osrm-route';
import { Location } from '../locations/location';

@Injectable({ providedIn: 'root' })
export class OsrmRouteService {
  osrmUrl = environment.osrmUrl;

  url = this.osrmUrl + 'route/v1/driving/';
  params = new HttpParams()
    .append('geometries', 'geojson')
    .append('overview', 'simplified');

  constructor(private httpClient: HttpClient) {}

  public retrieveRoute(locations: Location[]): Observable<OsrmRoute> {
    const path = locations
      .map((loc) => loc.lon.toString() + ',' + loc.lat.toString())
      .join(';');
    const url = this.url + path;
    const options = {
      params: this.params,
    };
    return this.httpClient.get<OsrmRoute>(url, options);
  }
}
