import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSelectedUserOrderSum } from '../../store';
import { AsyncPipe } from '@angular/common';
import type { Observable } from 'rxjs';

@Component({
  selector: 'app-selected-user-order-sum',
  standalone: true,
  imports: [AsyncPipe],
  template: `<span class="order-sum">{{ (orderSum$ | async) ?? 0 }}</span>`,
  styles: [
    `
      .order-sum {
        font-variant-numeric: tabular-nums;
      }
    `,
  ],
})
export class SelectedUserOrderSumComponent {
  orderSum$: Observable<number>;

  constructor(private store: Store) {
    this.orderSum$ = this.store.select(selectSelectedUserOrderSum);
  }
}
