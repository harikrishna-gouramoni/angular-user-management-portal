import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="container">
      <header class="header">
        <div class="brand">👤 User Management Portal</div>
        <div class="toolbar">
          <button class="btn" [routerLink]="['/users']">Users</button>
          <button class="btn" [routerLink]="['/add']">Add User</button>
          <button class="btn" (click)="toggleTheme()">
            {{ theme() === 'light' ? '🌙 Dark' : '☀️ Light' }}
          </button>
        </div>
      </header>

      <router-outlet></router-outlet>

      <footer class="footer">
        <small class="muted">Theme: {{ theme() }} • © {{ year }}</small>
      </footer>
    </div>
  `
})
export class AppComponent {
  readonly year = new Date().getFullYear();
  readonly theme = signal<'light' | 'dark'>('light');

  constructor() {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) this.theme.set(stored);
    document.body.classList.toggle('light', this.theme() === 'light');
  }

  toggleTheme() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    localStorage.setItem('theme', next);
    document.body.classList.toggle('light', next === 'light');
  }
}
