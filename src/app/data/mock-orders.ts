import { Order } from '../models/order.model';

/** Mock orders (id, userId, total). User 1=Alice, 2=Bob, 3=Charlie. */
export const MOCK_ORDERS: Order[] = [
  { id: 1, userId: 1, total: 7 },
  { id: 2, userId: 1, total: 4 },
  { id: 3, userId: 2, total: 6 },
  { id: 4, userId: 2, total: 5 },
  { id: 5, userId: 3, total: 10 },
];
