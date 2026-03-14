import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.model';

export const loadOrdersSuccess = createAction(
  '[Orders] Load Orders Success',
  props<{ orders: Order[] }>()
);

export const addOrder = createAction('[Orders] Add Order', props<{ order: Order }>());
export const updateOrder = createAction('[Orders] Update Order', props<{ order: Order }>());
export const removeOrder = createAction('[Orders] Remove Order', props<{ id: number }>());
