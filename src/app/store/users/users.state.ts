import { EntityState } from '@ngrx/entity';
import { User } from '../../models/user.model';

export interface UsersState extends EntityState<User> {
  selectedUserId: number | null;
}

export const usersFeatureKey = 'users';
