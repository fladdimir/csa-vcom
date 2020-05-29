import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from './order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  apiUrl = environment.apiUrl;

  url = this.apiUrl + 'orders/';

  constructor(private httpClient: HttpClient) {}

  public createOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(this.url, order);
  }

  public deleteOrder(order: Order): Observable<Order> {
    return this.httpClient.delete<Order>(this.url + order.id + '/');
  }

  public updateOrder(order: Order): Observable<Order> {
    return this.httpClient.put<Order>(this.url + order.id + '/', order);
  }
}
