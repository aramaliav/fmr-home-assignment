import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  selectAllOrders,
  selectNextOrderId,
  addOrder,
  updateOrder,
  removeOrder,
} from '../../store';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map, combineLatestWith } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import type { User } from '../../models/user.model';
import type { Order } from '../../models/order.model';

export interface UserOrdersDialogData {
  user: User;
}

@Component({
  selector: 'app-user-orders-dialog',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './user-orders-dialog.component.html',
  styleUrl: './user-orders-dialog.component.scss',
})
export class UserOrdersDialogComponent implements OnInit {
  private readonly data = inject<UserOrdersDialogData>(MAT_DIALOG_DATA);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  user = this.data.user;

  private readonly userId$ = new BehaviorSubject<number>(this.user.id);
  readonly orders$ = this.store.select(selectAllOrders).pipe(
    combineLatestWith(this.userId$),
    map(([orders, userId]) => orders.filter((o) => o.userId === userId))
  );
  nextOrderId = signal(1);
  newTotal = signal(0);

  editingId = signal<number | null>(null);
  editTotal = signal(0);

  displayedColumns = ['id', 'total', 'actions'];


  ngOnInit(): void {
    this.store
      .select(selectNextOrderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.nextOrderId.set(id));
  }

  startEdit(order: Order): void {
    this.editingId.set(order.id);
    this.editTotal.set(order.total);
  }

  saveEdit(): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.dispatch(
      updateOrder({
        order: {
          id,
          userId: this.user.id,
          total: this.editTotal(),
        },
      })
    );
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  addOrderForm(): void {
    const total = this.newTotal();
    if (total < 0) return;
    const orderId = this.nextOrderId();
    this.store.dispatch(
      addOrder({ order: { id: orderId, userId: this.user.id, total } })
    );
    this.newTotal.set(0);
  }

  removeOrderById(order: Order): void {
    this.store.dispatch(removeOrder({ id: order.id }));
    if (this.editingId() === order.id) this.cancelEdit();
  }
}
