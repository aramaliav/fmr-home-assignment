import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="dialog-backdrop" (click)="onBackdropClick($event)">
      <div class="dialog" (click)="$event.stopPropagation()">
        <p class="dialog-message">{{ message() }}</p>
        <div class="dialog-actions">
          <button type="button" class="btn-cancel" (click)="cancel()">Cancel</button>
          <button type="button" class="btn-confirm" (click)="confirm()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .dialog {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        padding: 1.5rem;
        min-width: 320px;
      }
      .dialog-message {
        margin: 0 0 1.25rem;
        font-size: 0.9375rem;
        color: #202124;
      }
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
      .btn-cancel {
        padding: 8px 16px;
        border: 1px solid #dadce0;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
      }
      .btn-cancel:hover {
        background: #f8f9fa;
      }
      .btn-confirm {
        padding: 8px 16px;
        border: none;
        background: #c5221f;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
      }
      .btn-confirm:hover {
        background: #a91b19;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  message = input.required<string>();
  confirmed = output<void>();
  cancelled = output<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.cancel();
    }
  }
}
