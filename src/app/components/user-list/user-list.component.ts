import { Component, OnInit, effect, signal } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { EditUserDialogComponent } from '../edit-user-dialog.component';
import { CreateUserDialogComponent } from '../create-user-dialog.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { HighlightDirective } from '../../directives/highlight.directive';
import { DomainPipe } from '../../pipes/domain.pipe';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, HighlightDirective, DomainPipe, ConfirmDialogComponent, EditUserDialogComponent, CreateUserDialogComponent],
  template: `
    <section class="card">
      <div class="row">
        <div class="col-6" style="display: flex; align-items: center;">
          <h2 style="margin-right: 1rem;">Users</h2>
        </div>
        <div class="col-6" style="text-align:right;">
          <input class="input" type="text" placeholder="Search by name or email..." [formControl]="searchControl">
        </div>
      </div>
 <div class="row">
       <div class="col-6" style="text-align:right;">
          <small class="muted">No. of rows per page.</small>
        </div>
        <div class="col-6" style="text-align:right;">
          <select style=" padding:2px 8px; font-size:0.92em; height:2rem; border-radius:4px; min-width:56px;" [(ngModel)]="pageSize">
            <option [ngValue]="5">5</option>
            <option [ngValue]="10">10</option>
            <option [ngValue]="25">25</option>
            <option [ngValue]="50">50</option>
            <option [ngValue]="-1">All</option>
          </select>
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
                        <div style="display: flex; gap: 0.5rem;">
                          <button class="btn" (click)="openEdit(u.id)">Edit</button>
                          <button class="danger" (click)="openConfirm(u.id)">Delete</button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6">No users found to display.</td></tr>
                  }
                </tbody>
              </table>

              <!-- Pagination -->
              <div class="pagination" style="margin-top: .75rem;">
                <button (click)="prevPage()" [disabled]="svc.page() === 1">Prev</button>
                <span>Page {{ svc.page() }} of {{ svc.totalPages() }}</span>
                <button (click)="nextPage()" [disabled]="svc.page() === svc.totalPages()">Next</button>
              </div>
              <div style="text-align:right;">
                  Total pages : {{ svc.totalPages() }}
              </div>
            }
          }
        </div>
      </div>
  </section>
  <!-- Add User dialog is managed by app header/root only -->
  <app-edit-user-dialog *ngIf="editId()" [user]="editingUser" (save)="saveEdit($event)" (cancel)="closeEdit()"></app-edit-user-dialog>
  <app-confirm-dialog *ngIf="showConfirm()" [open]="showConfirm()" (result)="onConfirmResult($event)"></app-confirm-dialog>
  `
})
export class UserListComponent implements OnInit {

  editId = signal<number|null>(null);
  get editingUser() {
    return this.editId() ? this.svc.getById(this.editId()!) : null;
  }
  openEdit(id: number) {
    this.editId.set(id);
  }
  closeEdit() {
    this.editId.set(null);
  }
  saveEdit(data: Partial<any>) {
    const id = this.editId();
    if (id) {
      this.svc.update(id, data);
      this.toast.show('User updated successfully!', 'success');
    }
    this.closeEdit();
  }
  searchControl = new FormControl('', { nonNullable: true });
  readonly selectedId = signal<number | null>(null);
  private confirmId = signal<number|null>(null);
  readonly showConfirm = () => this.confirmId() !== null;
  private searchSignal = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(250), distinctUntilChanged()),
    { initialValue: '' }
  );

  constructor(public svc: UserService, private toast: ToastService) {
    // Bridge search input (Observable) => signal
    effect(() => this.svc.query.set(this.searchSignal() ?? ''));
  }

  get pageSize() {
    return this.svc.pageSize();
  }
  set pageSize(val: number) {
    if (val === -1) {
      this.svc.pageSize.set(this.svc.filtered().length || 1);
    } else {
      this.svc.pageSize.set(val);
    }
  }

  ngOnInit(): void {
    if (this.svc.users().length === 0) {
      this.svc.fetchUsers(); // use API by default
    }
  }

  reload() { this.svc.fetchUsers(); }


  openConfirm(id: number) {
    this.confirmId.set(id);
  }

  onConfirmResult(yes: boolean) {
    const id = this.confirmId();
    if (yes && id !== null) {
      this.svc.remove(id);
      this.toast.show('User deleted successfully!', 'success');
    }
    this.confirmId.set(null);
  }

  prevPage() { if (this.svc.page() > 1) this.svc.page.set(this.svc.page() - 1); }
  nextPage() { if (this.svc.page() < this.svc.totalPages()) this.svc.page.set(this.svc.page() + 1); }
}
