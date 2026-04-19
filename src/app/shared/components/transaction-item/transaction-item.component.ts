import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TransactionModel } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
  standalone:false
})
export class TransactionItemComponent {
  @Input() transaction!: TransactionModel;
  @Input() showEmojiPicker = true;
  @Output() emojiUpdated = new EventEmitter<{ id: string; emoji: string }>();

  showPicker = false;
  longPressTimer: any;

  onLongPressStart(): void {
    if (!this.showEmojiPicker) return;
    this.longPressTimer = setTimeout(() => {
      this.showPicker = true;
    }, 2000);
  }

  onLongPressEnd(): void {
    clearTimeout(this.longPressTimer);
  }

  onEmojiSelect(event: any): void {
    this.emojiUpdated.emit({
      id: this.transaction.id!,
      emoji: event.emoji.native
    });
    this.showPicker = false;
  }

  closePicker(): void {
    this.showPicker = false;
  }

  get formattedDate(): string {
    return new Date(this.transaction.date).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  get formattedAmount(): string {
    return this.transaction.amount.toLocaleString('es-CO', {
      style: 'currency', currency: 'COP', maximumFractionDigits: 0
    });
  }
}