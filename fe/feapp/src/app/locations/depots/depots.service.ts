import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Depot } from './depot';

@Injectable({ providedIn: 'root' })
export class DepotService {
  apiUrl = environment.apiUrl;

  url = this.apiUrl + 'depots/';

  constructor(private httpClient: HttpClient) {}

  public findAll(): Observable<Depot[]> {
    return this.httpClient.get<Depot[]>(this.url);
  }

  public create(depot: Depot): Observable<Depot> {
    return this.httpClient.post<Depot>(this.url, depot);
  }

  public update(depot: Depot): Observable<Depot> {
    return this.httpClient.put<Depot>(this.getUrlToDepot(depot), depot);
  }

  public delete(depot: Depot): Observable<Depot> {
    return this.httpClient.delete<Depot>(this.getUrlToDepot(depot));
  }

  private getUrlToDepot(depot: Depot): string {
    return this.url + depot.id + '/';
  }
}
