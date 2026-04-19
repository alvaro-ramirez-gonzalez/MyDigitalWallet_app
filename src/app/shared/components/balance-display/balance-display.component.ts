import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-balance-display',
  templateUrl: './balance-display.component.html',
  styleUrls: ['./balance-display.component.scss'],
  standalone : false
})
export class BalanceDisplayComponent {
  @Input() balance = 0;
  @Input() isVisible = true;
  @Output() toggleVisibility = new EventEmitter<void>();

  get formattedBalance(): string {
    return this.balance.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    });
  }

  toggle(): void {
    this.toggleVisibility.emit();
  }
}