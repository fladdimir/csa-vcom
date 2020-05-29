import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from '../customers.service';
import { Customer } from '../customer';
import { Location } from '../../location';

@Component({
  selector: 'app-customer-creation-form',
  templateUrl: './customer-creation-form.component.html',
  styleUrls: ['./customer-creation-form.component.css'],
})
export class CustomerCreationFormComponent implements OnInit {
  customer = new Customer();

  constructor(
    public dialogRef: MatDialogRef<CustomerCreationFormComponent>,
    @Inject(MAT_DIALOG_DATA) private location: Location,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customer.location = this.location;
  }

  onConfirm(): void {
    this.customerService.create(this.customer).subscribe(
      (createdCustomer) => this.dialogRef.close(createdCustomer),
      (error) =>
        alert(
          'customer creation failed:\n' + JSON.stringify(error, undefined, 4)
        )
    );
  }
}
