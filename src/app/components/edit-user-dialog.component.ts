import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
// User type definition (replace fields as needed)
export interface User {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-backdrop">
      <div class="dialog-card">
        <h3>Edit User</h3>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div style="margin-bottom:1rem;">
            <label>Name</label>
            <input class="input" formControlName="name" placeholder="Full name">
          </div>
          <div style="margin-bottom:1rem;">
            <label>Email</label>
            <input class="input" formControlName="email" placeholder="name@domain.com">
          </div>
          <div style="margin-bottom:1rem;">
            <label>Phone</label>
            <input class="input" formControlName="phone" placeholder="Phone">
          </div>
          <div style="margin-bottom:1rem;">
            <label>Company</label>
            <input class="input" formControlName="company" placeholder="Company">
          </div>
          <div style="display:flex; gap:.5rem; justify-content:flex-end;">
            <button type="button" class="btn" (click)="cancel.emit()">Cancel</button>
            <button type="submit" class="primary" [disabled]="form.invalid">Save</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    }
    .dialog-card {
      background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      min-width: 320px;
    }
    .primary { background: #388e3c; color: #fff; border: none; padding: .5rem 1.2rem; border-radius: 4px; }
    .btn { background: #eee; color: #222; border: none; padding: .5rem 1.2rem; border-radius: 4px; }
    .input { width: 100%; padding: .4rem; border-radius: 4px; border: 1px solid #ccc; }
  `]
})
export class EditUserDialogComponent {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<Partial<User>>();
  @Output() cancel = new EventEmitter<void>();
  form;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: ['']
    });
  }
  ngOnChanges() {
    if (this.user) this.form.patchValue(this.user);
  }
  onSubmit() {
    if (this.form.valid) {
      const value = this.form.value;
      const user: Partial<User> = {
        name: value.name ?? undefined,
        email: value.email ?? undefined,
        phone: value.phone ?? undefined,
        company: value.company ?? undefined
      };
      this.save.emit(user);
    }
  }
}
