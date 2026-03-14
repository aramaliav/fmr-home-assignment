import {
  Component,
  input,
  output,
  OnInit,
  signal,
  effect,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { map, combineLatestWith } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import type { Observable } from 'rxjs';
import type { User } from '../../models/user.model';
import type { Order } from '../../models/order.model';

@Component({
  selector: 'app-user-orders-dialog',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './user-orders-dialog.component.html',
  styleUrl: './user-orders-dialog.component.scss',
})
export class UserOrdersDialogComponent implements OnInit {
  user = input.required<User>();

  closed = output<void>();

  private userId$ = new BehaviorSubject<number>(0);
  orders$!: Observable<Order[]>;
  nextOrderId = signal(1);
  newTotal = signal(0);

  editingId = signal<number | null>(null);
  editTotal = signal(0);

  constructor(
    private store: Store,
    private destroyRef: DestroyRef
  ) {
    this.orders$ = this.store.select(selectAllOrders).pipe(
      combineLatestWith(this.userId$),
      map(([orders, userId]) => orders.filter((o) => o.userId === userId))
    );
    effect(() => {
      const u = this.user();
      if (u) this.userId$.next(u.id);
    });
  }

  ngOnInit(): void {
    this.store
      .select(selectNextOrderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.nextOrderId.set(id));
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.close();
    }
  }

  startEdit(order: Order): void {
    this.editingId.set(order.id);
    this.editTotal.set(order.total);
  }

  saveEdit(): void {
    const id = this.editingId();
    const u = this.user();
    if (id === null || !u) return;
    this.store.dispatch(
      updateOrder({
        order: {
          id,
          userId: u.id,
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
    const u = this.user();
    const total = this.newTotal();
    if (!u || total < 0) return;
    const orderId = this.nextOrderId();
    this.store.dispatch(addOrder({ order: { id: orderId, userId: u.id, total } }));
    this.newTotal.set(0);
  }

  removeOrderById(order: Order): void {
    this.store.dispatch(removeOrder({ id: order.id }));
    if (this.editingId() === order.id) this.cancelEdit();
  }
}
