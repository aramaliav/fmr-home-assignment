import { createReducer, on } from '@ngrx/store';
import { ordersAdapter } from './orders.adapter';
import * as OrdersActions from './orders.actions';

const initialState = ordersAdapter.getInitialState();

export const ordersReducer = createReducer(
  initialState,
  on(OrdersActions.loadOrdersSuccess, (state, { orders }) =>
    ordersAdapter.setAll(orders, state)
  ),
  on(OrdersActions.addOrder, (state, { order }) =>
    ordersAdapter.upsertOne(order, state)
  ),
  on(OrdersActions.updateOrder, (state, { order }) =>
    ordersAdapter.upsertOne(order, state)
  ),
  on(OrdersActions.removeOrder, (state, { id }) =>
    ordersAdapter.removeOne(id, state)
  )
);
