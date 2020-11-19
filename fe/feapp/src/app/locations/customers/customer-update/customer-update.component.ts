import { Component, OnInit, Inject } from '@angular/core';
import { Customer } from '../customer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from '../customers.service';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.css'],
})
export class CustomerUpdateComponent implements OnInit {
  customer: Customer;
  constructor(
    public dialogRef: MatDialogRef<CustomerUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) customerArg: Customer,
    private customerService: CustomerService
  ) {
    this.customer = customerArg;
  }

  ngOnInit(): void {}

  onUpdate(): void {
    this.customerService.update(this.customer).subscribe(
      () => this.dialogRef.close(true),
      (error) => alert('Customer update failed:\n' + JSON.stringify(error))
    );
  }

  onDelete(): void {
    this.customerService.delete(this.customer).subscribe(
      () => this.dialogRef.close(true),
      (error) => alert('Customer update failed:\n' + JSON.stringify(error))
    );
  }
}
