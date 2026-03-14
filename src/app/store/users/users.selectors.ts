import { createFeatureSelector, createSelector } from '@ngrx/store';
import { usersAdapter } from './users.adapter';
import { UsersState, usersFeatureKey } from './users.state';
import { ordersFeatureKey } from '../orders/orders.state';
import type { OrdersState } from '../orders/orders.state';
import { ordersAdapter } from '../orders/orders.adapter';

export const selectUsersState = createFeatureSelector<UsersState>(usersFeatureKey);
export const selectOrdersState = createFeatureSelector<OrdersState>(ordersFeatureKey);

const { selectEntities, selectAll } = usersAdapter.getSelectors();
const ordersSelectors = ordersAdapter.getSelectors();

export const selectUserEntities = createSelector(selectUsersState, selectEntities);
export const selectAllUsers = createSelector(selectUsersState, selectAll);

export const selectSelectedUserId = createSelector(
  selectUsersState,
  (state) => state.selectedUserId
);

export const selectSelectedUser = createSelector(
  selectUserEntities,
  selectSelectedUserId,
  (entities, id) => (id !== null ? entities[id] ?? null : null)
);

export const selectAllOrders = createSelector(
  selectOrdersState,
  ordersSelectors.selectAll
);

export const selectSelectedUserOrders = createSelector(
  selectSelectedUserId,
  selectAllOrders,
  (userId, orders) =>
    userId !== null ? orders.filter((o) => o.userId === userId) : []
);

export const selectSelectedUserSummary = createSelector(
  selectSelectedUser,
  selectSelectedUserOrders,
  (user, orders) => {
    const total = orders.reduce((sum, o) => sum + o.total, 0);
    return {
      userName: user?.name ?? '',
      totalOrdersSum: total,
    };
  }
);

/** Selector for the selected user's name only (used by SelectedUserNameComponent). */
export const selectSelectedUserName = createSelector(
  selectSelectedUserSummary,
  (summary) => summary.userName
);

/** Selector for the selected user's order sum only (used by SelectedUserOrderSumComponent). */
export const selectSelectedUserOrderSum = createSelector(
  selectSelectedUserSummary,
  (summary) => summary.totalOrdersSum
);

export const selectNextUserId = createSelector(selectAllUsers, (users) => {
  if (users.length === 0) return 1;
  return Math.max(...users.map((u) => u.id)) + 1;
});
