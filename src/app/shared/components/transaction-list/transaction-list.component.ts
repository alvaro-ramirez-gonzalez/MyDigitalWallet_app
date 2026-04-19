import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TransactionModel } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  standalone : false
})
export class TransactionListComponent {
  @Input() transactions: TransactionModel[] = [];
  @Input() showEmojiPicker = true;
  @Output() emojiUpdated = new EventEmitter<{ id: string; emoji: string }>();

  onEmojiUpdated(event: { id: string; emoji: string }): void {
    this.emojiUpdated.emit(event);
  }
}