import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer } from './customer';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  apiUrl = environment.apiUrl;
  url = this.apiUrl + 'customers/';

  constructor(private httpClient: HttpClient) {}

  public findAll(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.url);
  }

  public findOne(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>(this.url + id + '/');
  }

  public create(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(this.url, customer);
  }

  public update(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(
      this.getUrlToCustomer(customer),
      customer
    );
  }

  public delete(customer: Customer): Observable<Customer> {
    return this.httpClient.delete<Customer>(this.getUrlToCustomer(customer));
  }

  private getUrlToCustomer(customer: Customer): string {
    return this.url + customer.id + '/';
  }
}
