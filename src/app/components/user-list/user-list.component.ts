import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HighlightDirective } from '../../directives/highlight.directive';
import { DomainPipe } from '../../pipes/domain.pipe';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, HighlightDirective, DomainPipe],
  template: `
    <section class="card">
      <div class="row">
        <div class="col-6">
          <h2>Users</h2>
          <small class="muted">Fetched from API or local mock</small>
        </div>
        <div class="col-6" style="text-align:right;">
          <input class="input" type="text" placeholder="Search by name or email..." [formControl]="searchControl">
        </div>
      </div>

      <div class="row" style="margin-top: 1rem;">
        <div class="col-12">
          @if (svc.loading()) {
            <div style="display:flex; align-items:center;"><div class="spinner"></div> Loading users...</div>
          } @else {
            @if (svc.error(); as err) {
              <div class="card" style="border-color: var(--danger);">
                <strong>Error:</strong> {{ err }}
                <div style="margin-top:.6rem;">
                  <button (click)="reload()" class="primary">Retry</button>
                </div>
              </div>
            } @else {
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Email <small class="muted">(domain)</small></th><th>Phone</th><th>Company</th><th style="width: 180px;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (u of svc.paged(); track u.id) {
                    <tr [appHighlight]="selectedId() === u.id">
                      <td>{{ u.id }}</td>
                      <td>{{ u.name }}</td>
                      <td>{{ u.email }} <small class="badge">{{ u.email | domain }}</small></td>
                      <td>{{ u.phone || '—' }}</td>
                      <td>{{ u.company || '—' }}</td>
                      <td>
                        <a [routerLink]="['/details', u.id]" class="btn">Details</a>
                        <a [routerLink]="['/edit', u.id]" class="btn">Edit</a>
                        <button class="danger" (click)="confirmDelete(u.id)">Delete</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6">No users to display.</td></tr>
                  }
                </tbody>
              </table>

              <!-- Pagination -->
              <div class="pagination" style="margin-top: .75rem;">
                <button (click)="prevPage()" [disabled]="svc.page() === 1">Prev</button>
                <span>Page {{ svc.page() }} / {{ svc.totalPages() }}</span>
                <button (click)="nextPage()" [disabled]="svc.page() === svc.totalPages()">Next</button>
                <select style="margin-left:auto" [(ngModel)]="pageSize">
                  <option [ngValue]="5">5</option>
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="20">20</option>
                </select>
  pageSize = 10;
              </div>
            }
          }
        </div>
      </div>
    </section>
  `
})
export class UserListComponent implements OnInit {
  searchControl = new FormControl('', { nonNullable: true });
  readonly selectedId = signal<number | null>(null);
  private searchSignal = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(250), distinctUntilChanged()),
    { initialValue: '' }
  );

  constructor(public svc: UserService) {
    // Bridge search input (Observable) => signal
    effect(() => this.svc.query.set(this.searchSignal() ?? ''));
  }

  get pageSize() {
    return this.svc.pageSize();
  }
  set pageSize(val: number) {
    this.svc.pageSize.set(val);
  }

  ngOnInit(): void {
    if (this.svc.users().length === 0) {
      this.svc.fetchUsers(false); // change to true to use mock file
    }
  }

  reload() { this.svc.fetchUsers(false); }

  confirmDelete(id: number) {
    if (confirm('Delete this user?')) {
      this.svc.remove(id);
    }
  }

  prevPage() { if (this.svc.page() > 1) this.svc.page.set(this.svc.page() - 1); }
  nextPage() { if (this.svc.page() < this.svc.totalPages()) this.svc.page.set(this.svc.page() + 1); }
}
