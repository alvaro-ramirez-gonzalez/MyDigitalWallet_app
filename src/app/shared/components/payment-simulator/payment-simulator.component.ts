import { PaymentService } from '../../../core/services/payment';
import { CardModel } from '../../../core/models/card.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-payment-simulator',
  templateUrl: './payment-simulator.component.html',
  styleUrls: ['./payment-simulator.component.scss'],
  standalone: false
})
export class PaymentSimulatorComponent implements OnInit {
  @Output() paymentConfirmed = new EventEmitter<{ merchant: string; amount: number; card: CardModel }>();
  @Output() cancelled = new EventEmitter<void>();

  @Input() card!: CardModel;

  currentPayment = { merchant: '', amount: 0 };
  isProcessing = false;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.generate();
  }

  generate(): void {
    this.currentPayment = this.paymentService.generateFakePayment();
  }

  get formattedAmount(): string {
    return this.currentPayment.amount.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    });
  }

  confirm(): void {
    this.paymentConfirmed.emit({
      merchant: this.currentPayment.merchant,
      amount: this.currentPayment.amount,
      card: this.card
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}