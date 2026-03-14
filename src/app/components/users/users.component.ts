import { Component, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  selectAllUsers,
  selectSelectedUserId,
  selectNextUserId,
  setSelectedUserId,
  addUser,
  updateUser,
  removeUser,
} from '../../store';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserOrdersComponent } from '../user-orders-component/user-orders-component.component';
import { UserOrdersDialogComponent } from '../user-orders-dialog/user-orders-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import type { Observable } from 'rxjs';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, FormsModule, UserOrdersComponent, UserOrdersDialogComponent, ConfirmDialogComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  selectedUserId$: Observable<number | null>;
  nextUserId$: Observable<number>;

  editingId = signal<number | null>(null);
  editName = signal('');
  newUserName = signal('');
  newUserId = signal(0);
  dialogUser = signal<User | null>(null);
  confirmDeleteUser = signal<User | null>(null);

  constructor(
    private store: Store,
    private destroyRef: DestroyRef
  ) {
    this.users$ = this.store.select(selectAllUsers);
    this.selectedUserId$ = this.store.select(selectSelectedUserId);
    this.nextUserId$ = this.store.select(selectNextUserId);
  }

  ngOnInit(): void {
    this.store
      .select(selectNextUserId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.newUserId.set(id));
  }

  selectUser(id: number | null): void {
    this.store.dispatch(setSelectedUserId({ id }));
  }

  openDialog(user: User): void {
    this.dialogUser.set(user);
    this.store.dispatch(setSelectedUserId({ id: user.id }));
  }

  closeDialog(): void {
    this.dialogUser.set(null);
  }

  startEdit(row: User): void {
    this.editingId.set(row.id);
    this.editName.set(row.name);
  }

  saveEdit(): void {
    const id = this.editingId();
    const name = this.editName().trim();
    if (id !== null && name) {
      this.store.dispatch(updateUser({ user: { id, name } }));
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editName.set('');
  }

  addUserForm(): void {
    const name = this.newUserName().trim();
    const id = this.newUserId();
    if (name && id !== undefined) {
      this.store.dispatch(addUser({ user: { id, name } }));
      this.newUserName.set('');
    }
  }

  confirmDelete(user: User): void {
    this.confirmDeleteUser.set(user);
  }

  cancelConfirmDelete(): void {
    this.confirmDeleteUser.set(null);
  }

  getDeleteConfirmMessage(user: User): string {
    return `Are you sure you want to delete ${user.name}?`;
  }

  removeUserById(id: number): void {
    this.store.dispatch(removeUser({ id }));
    if (this.editingId() === id) this.cancelEdit();
    this.confirmDeleteUser.set(null);
  }
}
