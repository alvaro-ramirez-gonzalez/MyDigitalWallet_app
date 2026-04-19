import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss'],
  standalone: false
})
export class QuickActionsComponent {
  @Output() onTransfer = new EventEmitter<void>();
  @Output() onRecharge = new EventEmitter<void>();
  @Output() onPay      = new EventEmitter<void>();
}