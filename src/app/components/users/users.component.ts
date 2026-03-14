import { Component, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
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
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserOrdersComponent } from '../user-orders-component/user-orders-component.component';
import { UserOrdersDialogComponent } from '../user-orders-dialog/user-orders-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import type { Observable } from 'rxjs';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    UserOrdersComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  selectedUserId$: Observable<number | null>;
  nextUserId$: Observable<number>;
  usersDataSource = new MatTableDataSource<User>([]);

  displayedColumns = ['id', 'name', 'actions', 'editOrder'];

  editingId = signal<number | null>(null);
  editName = signal('');
  newUserName = signal('');
  newUserId = signal(0);

  constructor(
    private store: Store,
    private destroyRef: DestroyRef,
    private dialog: MatDialog
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

    this.store
      .select(selectAllUsers)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => (this.usersDataSource.data = users));
  }

  selectUser(id: number | null): void {
    this.store.dispatch(setSelectedUserId({ id }));
  }

  openDialog(user: User): void {
    this.store.dispatch(setSelectedUserId({ id: user.id }));
    this.dialog.open(UserOrdersDialogComponent, {
      width: '520px',
      data: { user },
    });
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
    if (name) {
      this.store.dispatch(addUser({ user: { id, name } }));
      this.newUserName.set('');
    }
  }

  confirmDelete(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Are you sure you want to delete ${user.name}?` },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeUserById(user.id);
      }
    });
  }

  removeUserById(id: number): void {
    this.store.dispatch(removeUser({ id }));
    if (this.editingId() === id) this.cancelEdit();
  }
}
