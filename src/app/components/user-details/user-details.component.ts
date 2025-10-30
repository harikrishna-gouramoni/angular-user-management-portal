import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { DomainPipe } from '../../pipes/domain.pipe';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterLink, DomainPipe],
  template: `
    <section class="card">
      @if (user) {
        <h2>{{ user.name }}</h2>
        <p><strong>Email:</strong> {{ user.email }} <span class="badge">{{ user.email | domain }}</span></p>
        <p><strong>Phone:</strong> {{ user.phone || '—' }}</p>
        <p><strong>Company:</strong> {{ user.company || '—' }}</p>
        <div style="margin-top:1rem; display:flex; gap:.5rem;">
          <a class="btn" [routerLink]="['/edit', user.id]">Edit</a>
          <a class="btn" [routerLink]="['/users']">Back</a>
        </div>
      } @else {
        <div>Loading...</div>
      }
    </section>
  `
})
export class UserDetailsComponent implements OnInit {
  user: any;

  constructor(private route: ActivatedRoute, private svc: UserService) {}

  ngOnInit(): void {
    this.user = this.svc.getById(Number(this.route.snapshot.paramMap.get('id')));
    if (!this.user && this.svc.users().length === 0) {
      // if user navigated directly, fetch list first then hydrate user
      this.svc.fetchUsers(false);
      setTimeout(() => {
        this.user = this.svc.getById(Number(this.route.snapshot.paramMap.get('id')));
      }, 500);
    }
  }
}
