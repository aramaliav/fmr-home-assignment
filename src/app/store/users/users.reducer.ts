import { createReducer, on } from '@ngrx/store';
import { usersAdapter } from './users.adapter';
import { UsersState } from './users.state';
import * as UsersActions from './users.actions';

const initialState: UsersState = usersAdapter.getInitialState({
  selectedUserId: null,
});

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.setAll(users, state)
  ),
  on(UsersActions.addUser, (state, { user }) =>
    usersAdapter.upsertOne(user, state)
  ),
  on(UsersActions.updateUser, (state, { user }) =>
    usersAdapter.upsertOne(user, state)
  ),
  on(UsersActions.removeUser, (state, { id }) => {
    const nextState = usersAdapter.removeOne(id, state);
    return state.selectedUserId === id
      ? { ...nextState, selectedUserId: null }
      : nextState;
  }),
  on(UsersActions.setSelectedUserId, (state, { id }) => ({
    ...state,
    selectedUserId: id,
  })),
  on(UsersActions.loadUserDetailsSuccess, (state, { user }) => {
    const existing = state.entities[user.id];
    // Don't overwrite an existing user with API data (e.g. after name was edited)
    if (existing && existing.name !== 'Unknown') {
      return state;
    }
    return usersAdapter.upsertOne(user, state);
  })
);
