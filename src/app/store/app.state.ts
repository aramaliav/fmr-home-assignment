import { UsersState } from './users/users.state';
import { OrdersState } from './orders/orders.state';

export interface AppState {
  users: UsersState;
  orders: OrdersState;
}
