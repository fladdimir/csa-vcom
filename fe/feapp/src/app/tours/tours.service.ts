import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TourLocations,
  RecalculateToursResponse,
  TrucksToursMatchResponse,
  Tour,
} from './tour';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TourService {
  apiUrl = environment.apiUrl;

  url = this.apiUrl + 'tour-locations/';

  recalculateToursUrl = this.apiUrl + 'recalculate-pending-tours/';

  matchTrucksAndToursUrl = this.apiUrl + 'match-tours-and-trucks/';

  constructor(private httpClient: HttpClient) {}

  public findAllTourLocations(): Observable<TourLocations[]> {
    return this.httpClient.get<TourLocations[]>(this.url);
  }

  public findTourLocations(tourId: number): Observable<TourLocations> {
    return this.httpClient.get<TourLocations>(this.url + tourId + '/');
  }

  public recalculatePendingTours(): Observable<RecalculateToursResponse> {
    return this.httpClient.post<RecalculateToursResponse>(
      this.recalculateToursUrl,
      undefined
    );
  }

  public matchTrucksAndTours(): Observable<TrucksToursMatchResponse> {
    return this.httpClient.post<TrucksToursMatchResponse>(
      this.matchTrucksAndToursUrl,
      undefined
    );
  }
}
