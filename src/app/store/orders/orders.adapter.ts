import { createEntityAdapter } from '@ngrx/entity';
import { Order } from '../../models/order.model';

export const ordersAdapter = createEntityAdapter<Order>({
  selectId: (order) => order.id,
});
