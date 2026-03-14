import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SelectedUserNameComponent } from '../selected-user-name/selected-user-name.component';
import { SelectedUserOrderSumComponent } from '../selected-user-order-sum/selected-user-order-sum.component';

/**
 * UserOrdersComponent – displays the selected user's name and the sum of all their orders.
 * Split into two components: SelectedUserNameComponent and SelectedUserOrderSumComponent.
 */
@Component({
  selector: 'app-user-orders-component',
  standalone: true,
  imports: [
    MatCardModule,
    SelectedUserNameComponent,
    SelectedUserOrderSumComponent,
  ],
  templateUrl: './user-orders-component.component.html',
  styleUrl: './user-orders-component.component.scss',
})
export class UserOrdersComponent {}
