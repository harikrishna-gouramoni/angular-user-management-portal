
import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="dialog-backdrop">
      <div class="dialog-card">
        <h3>Confirm Delete</h3>
        <div>Are you sure you want to delete this user?</div>
        <div class="dialog-actions">
          <button class="btn" (click)="onNo()">No</button>
          <button class="btn danger" (click)="onYes()">Yes</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog-card {
      background: #fff;
      border-radius: 8px;
      padding: 2rem 1.5rem;
      min-width: 280px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.18);
      text-align: center;
    }
    .dialog-actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .btn.danger {
      background: #e53935;
      color: #fff;
    }
  `],
  standalone: true
})
export class ConfirmDialogComponent {
  @Output() result = new EventEmitter<boolean>();
  @Input() open = false;
  onYes() { this.result.emit(true); }
  onNo() { this.result.emit(false); }
}
