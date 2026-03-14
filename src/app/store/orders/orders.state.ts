import { EntityState } from '@ngrx/entity';
import { Order } from '../../models/order.model';

export type OrdersState = EntityState<Order>;

export const ordersFeatureKey = 'orders';
