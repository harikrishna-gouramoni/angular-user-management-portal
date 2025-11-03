import { Injectable, computed, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, of, retry } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = 'https://jsonplaceholder.typicode.com/users';
  // State signals
  readonly users = signal<User[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // UI state
  readonly pageSize = signal<number>(5);
  readonly page = signal<number>(1);
  readonly query = signal<string>('');

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    const list = this.users();
    if (!q) return list;
    return list.filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));
  readonly paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  constructor(private http: HttpClient) {
    // Autosave/log effect
    effect(() => {
      const count = this.users().length;
      console.debug('[UserService] Users in memory:', count);
    });
  }

  fetchUsers(useMock = false) {
    this.loading.set(true);
    this.error.set(null);

    // Always use API unless useMock is true
    const source$ = useMock
      ? this.http.get<User[]>('/assets/users.json').pipe(delay(300))
      : this.http.get<User[]>(this.api).pipe(
          retry(2) // retry network errors up to 2 times
        );

    source$
      .pipe(
        map(list => list.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          company: (u as any).company?.name || u.company
        }))),
        catchError(err => {
          this.error.set('Failed to load users. Please try again.');
          console.error(err);
          return of([] as User[]);
        })
      )
      .subscribe(list => {
        this.users.set(list);
        this.loading.set(false);
      });
  }

  getById(id: number) {
    return this.users().find(u => u.id === id) ?? null;
  }

  add(user: Omit<User, 'id'>) {
    const nextId = (this.users().reduce((m, u) => Math.max(m, u.id), 0) || 0) + 1;
    const newUser: User = { id: nextId, ...user };
    this.users.update(prev => [newUser, ...prev]);
    return newUser;
  }

  update(id: number, patch: Partial<User>) {
    this.users.update(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
  }

  remove(id: number) {
    this.users.update(prev => prev.filter(u => u.id !== id));
  }
}
