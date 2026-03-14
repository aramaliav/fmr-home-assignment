import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: unknown }>()
);

export const addUser = createAction('[Users] Add User', props<{ user: User }>());
export const updateUser = createAction('[Users] Update User', props<{ user: User }>());
export const removeUser = createAction('[Users] Remove User', props<{ id: number }>());

export const setSelectedUserId = createAction(
  '[Users] Set Selected User Id',
  props<{ id: number | null }>()
);

export const loadUserDetailsSuccess = createAction(
  '[Users] Load User Details Success',
  props<{ user: User }>()
);
export const loadUserDetailsFailure = createAction(
  '[Users] Load User Details Failure',
  props<{ error: unknown }>()
);
