import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ordersAdapter } from './orders.adapter';
import { OrdersState, ordersFeatureKey } from './orders.state';

const selectOrdersFeatureState = createFeatureSelector<OrdersState>(ordersFeatureKey);

const ordersSelectors = ordersAdapter.getSelectors();

const selectAllOrdersFromFeature = createSelector(
  selectOrdersFeatureState,
  ordersSelectors.selectAll
);

export const selectNextOrderId = createSelector(
  selectAllOrdersFromFeature,
  (orders) => {
    if (orders.length === 0) return 1;
    return Math.max(...orders.map((o) => o.id)) + 1;
  }
);
