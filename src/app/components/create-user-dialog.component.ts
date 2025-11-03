import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-backdrop">
      <div class="dialog-card">
        <h3>Create User</h3>
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
            <button type="submit" class="primary" [disabled]="form.invalid">Create</button>
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
export class CreateUserDialogComponent {
  @Output() create = new EventEmitter<any>();
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
  onSubmit() {
    if (this.form.valid) this.create.emit(this.form.value);
  }
}
