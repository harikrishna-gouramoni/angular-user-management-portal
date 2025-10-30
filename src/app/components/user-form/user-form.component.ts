import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="card">
      <h2>{{ isEdit ? 'Edit User' : 'Add User' }}</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="row">
        <div class="col-6">
          <label>Name</label>
          <input class="input" formControlName="name" placeholder="Full name">
          @if (form.controls.name.touched && form.controls.name.invalid) {
            <small style="color:var(--danger)">Name is required (min 3).</small>
          }
        </div>

        <div class="col-6">
          <label>Email</label>
          <input class="input" formControlName="email" placeholder="name@domain.com">
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <small style="color:var(--danger)">Valid email is required.</small>
          }
        </div>

        <div class="col-6">
          <label>Phone</label>
          <input class="input" formControlName="phone" placeholder="Phone">
        </div>

        <div class="col-6">
          <label>Company</label>
          <input class="input" formControlName="company" placeholder="Company">
        </div>

        <div class="col-12" style="display:flex; gap:.5rem; margin-top:.5rem;">
          <button class="primary" type="submit" [disabled]="form.invalid">{{ isEdit ? 'Save' : 'Create' }}</button>
          <a class="btn" [routerLink]="['/users']">Cancel</a>
        </div>
      </form>
    </section>
  `
})
export class UserFormComponent implements OnInit {
  form;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: UserService
  ) {
    this.form = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: ['']
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!id;
    if (this.isEdit) {
      const u = this.svc.getById(id);
      if (u) this.form.patchValue(u);
    }

    // autosave (bonus): log form value when valid
    effect(() => {
      if (this.form.valid) {
        console.debug('[Autosave preview]', this.form.value);
      }
    });
  }

  // ...existing code...

  // Ensure nulls are converted to undefined before update
  updateUser(id: number, data: any) {
    const cleanData = { ...data };
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === null) cleanData[key] = undefined;
    });
    this.svc.update(id, cleanData);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { id, ...data } = this.form.value;
    if (this.isEdit && id) {
      // Convert nulls to undefined for User type compatibility
      const cleanData: Partial<User> = {
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        company: data.company ?? undefined
      };
      this.svc.update(id, cleanData);
      alert('User updated!');
    } else {
      this.svc.add(data as any);
      alert('User created!');
    }
    this.router.navigate(['/users']);
  }
}
