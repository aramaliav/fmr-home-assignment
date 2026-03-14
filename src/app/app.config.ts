import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { routes } from './app.routes';
import { usersReducer } from './store/users/users.reducer';
import { ordersReducer } from './store/orders/orders.reducer';
import { usersFeatureKey } from './store/users/users.state';
import { ordersFeatureKey } from './store/orders/orders.state';
import { appEffects } from './store/effects.index';
import { appInit } from './store/app.actions';

export function initializeApp(store: Store) {
  return () => {
    store.dispatch(appInit());
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({
      [usersFeatureKey]: usersReducer,
      [ordersFeatureKey]: ordersReducer,
    }),
    provideEffects(appEffects),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [Store],
      multi: true,
    },
  ],
};
