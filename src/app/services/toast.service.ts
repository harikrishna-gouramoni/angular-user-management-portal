import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal<string | null>(null);
  type = signal<'success' | 'error' | null>(null);
  timeout: any;

  show(msg: string, type: 'success' | 'error' = 'success', duration = 2500) {
    this.message.set(msg);
    this.type.set(type);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.clear(), duration);
  }

  clear() {
    this.message.set(null);
    this.type.set(null);
  }
}
