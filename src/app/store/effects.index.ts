import {
  loadUsersOnInit$,
  loadUsers$,
  loadUserDetailsOnSelectedUser$,
} from './users/users.effects';
import { loadOrdersOnInit$ } from './orders/orders.effects';

export const appEffects = {
  loadUsersOnInit$,
  loadUsers$,
  loadUserDetailsOnSelectedUser$,
  loadOrdersOnInit$,
};
