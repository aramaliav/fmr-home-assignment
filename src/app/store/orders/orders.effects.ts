import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { MOCK_ORDERS } from '../../data/mock-orders';
import * as AppActions from '../app.actions';
import * as OrdersActions from './orders.actions';

export const loadOrdersOnInit$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AppActions.appInit),
      map(() => OrdersActions.loadOrdersSuccess({ orders: MOCK_ORDERS }))
    ),
  { functional: true }
);
