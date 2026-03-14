import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';
import * as AppActions from '../app.actions';
import * as UsersActions from './users.actions';

export const loadUsersOnInit$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AppActions.appInit),
      map(() => UsersActions.loadUsers())
    ),
  { functional: true }
);

export const loadUsers$ = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        userService.getUsers().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((error) => of(UsersActions.loadUsersFailure({ error })))
        )
      )
    ),
  { functional: true }
);

/**
 * When selectedUserId changes – fetches additional user details.
 * switchMap automatically cancels the previous API call if the selected user changes
 * before the call completes (using RxJS pipes and store).
 */
export const loadUserDetailsOnSelectedUser$ = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(UsersActions.setSelectedUserId),
      filter(({ id }) => id !== null),
      switchMap(({ id }) =>
        userService.getUserDetails(id!).pipe(
          map((user) => UsersActions.loadUserDetailsSuccess({ user })),
          catchError((error) => of(UsersActions.loadUserDetailsFailure({ error })))
        )
      )
    ),
  { functional: true }
);
