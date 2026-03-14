import { createEntityAdapter } from '@ngrx/entity';
import { User } from '../../models/user.model';

export const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
});
