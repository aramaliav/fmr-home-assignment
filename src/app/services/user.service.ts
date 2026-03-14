import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { User } from '../models/user.model';

/** Mock users. */
const MOCK_USERS: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

@Injectable({ providedIn: 'root' })
export class UserService {
  
  getUsers(): Observable<User[]> {
    return of(MOCK_USERS).pipe(delay(300));
  }

  getUserDetails(userId: number): Observable<User> {
    const user = MOCK_USERS.find((u) => u.id === userId);
    return of(user ?? { id: userId, name: 'Unknown' }).pipe(
      delay(500)
    );
  }
}
