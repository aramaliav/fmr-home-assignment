import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSelectedUserName } from '../../store';
import { AsyncPipe } from '@angular/common';
import type { Observable } from 'rxjs';

@Component({
  selector: 'app-selected-user-name',
  standalone: true,
  imports: [AsyncPipe],
  template: `<span class="user-name">{{ (userName$ | async) ?? '—' }}</span>`,
  styles: [
    `
      .user-name {
        font-weight: 600;
      }
    `,
  ],
})
export class SelectedUserNameComponent {
  userName$: Observable<string>;

  constructor(private store: Store) {
    this.userName$ = this.store.select(selectSelectedUserName);
  }
}
