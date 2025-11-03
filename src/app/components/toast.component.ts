import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message()" class="toast" [ngClass]="type()">
      <span>{{ message() }}</span>
      <button class="toast-close" (click)="close()" aria-label="Close">×</button>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      left: 50%;
      top: 1.5rem;
      transform: translateX(-50%);
      min-width: 180px;
      background: #323232;
      color: #fff;
      padding: 0.75rem 2.5rem 0.75rem 1.5rem;
      border-radius: 6px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.18);
      font-size: 1rem;
      z-index: 2000;
      opacity: 0.97;
      transition: opacity 0.2s;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    .toast-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      margin-left: 0.5rem;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .toast-close:hover { opacity: 1; }
    .toast.success { background: #388e3c; }
    .toast.error { background: #d32f2f; }
  `]
})
export class ToastComponent {
  message;
  type;
  timeout: any;
  constructor(public toast: ToastService) {
    this.message = toast.message;
    this.type = toast.type;
    effect(() => {
      if (this.message()) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.close(), 3000);
      }
    });
  }
  close() {
    this.toast.clear();
  }
}
