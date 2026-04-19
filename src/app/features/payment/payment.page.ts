import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth';
import { CardService } from '../../core/services/card';
import { PaymentService } from '../../core/services/payment';
import { ToastService } from '../../core/services/toast';
import { LoadingService } from '../../core/services/loading';
import { DialogService } from '../../core/services/dialog';
import { NotificationService } from '../../core/services/notification';
import { UserService } from '../../core/services/user';
import { CardModel } from '../../core/models/card.model';
import { TransactionModel } from '../../core/models/transaction.model';
import { UserModel } from '../../core/models/user.model';
import { BiometricService } from '../../core/services/biometric'; 

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: false
})
export class PaymentPage implements OnInit, OnDestroy {

  cards: CardModel[] = [];
  selectedCard: CardModel | null = null;
  recentTransactions: TransactionModel[] = [];
  isLoadingCards = true;
  isProcessing = false;

  currentPayment = { merchant: '', amount: 0 };

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private cardService: CardService,
    private paymentService: PaymentService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private userService: UserService,
    private biometricService: BiometricService // Corregido: Faltaba la inyección
  ) {}

  ngOnInit(): void {
    this.generateNewPayment();
    this.loadCards();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateNewPayment(): void {
    this.currentPayment = this.paymentService.generateFakePayment();
  }

  private loadCards(): void {
    const user = this.authService.currentUser;
    if (!user) return;

    this.isLoadingCards = true;
    this.cardService.getCards(user.uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cards: CardModel[]) => {
        this.cards = cards;
        this.isLoadingCards = false;
        if (cards.length > 0) {
          this.selectedCard = cards[0];
          this.loadRecentTransactions(user.uid);
        }
      });
  }

  private loadRecentTransactions(uid: string): void {
    this.paymentService.getTransactions(uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactions: TransactionModel[]) => {
        this.recentTransactions = transactions.slice(0, 5);
      });
  }

  selectCard(card: CardModel): void {
    this.selectedCard = card;
  }

  async onPay(): Promise<void> {
    if (!this.selectedCard) return;

    // 1. Verificar biometría antes de pagar
    const biometricAvailable = await this.biometricService.isAvailable();
    if (biometricAvailable) {
      const verified = await this.biometricService.verify('Autorizar pago');
      if (!verified) {
        await this.toastService.showError('Verificación biométrica fallida');
        return;
      }
    }

    // 2. Confirmación de diálogo
    const confirmed = await this.dialogService.confirm(
      'Confirmar pago',
      `¿Deseas pagar ${this.currentPayment.amount.toLocaleString('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
      })} en ${this.currentPayment.merchant}?`
    );

    if (!confirmed) return;

    const user = this.authService.currentUser;
    if (!user) return;

    this.isProcessing = true;

    try {
      await this.loadingService.show('Procesando pago...');

      await this.paymentService.processPayment(
        user.uid,
        this.selectedCard.id!,
        this.currentPayment.merchant,
        this.currentPayment.amount
      );

      await this.notificationService.vibrateSuccess();

      this.userService.getUserProfile(user.uid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (profile: UserModel) => {
          if (profile?.fcmToken) {
            await this.notificationService.sendPaymentNotification(
              profile.fcmToken,
              this.currentPayment.merchant,
              this.currentPayment.amount
            );
          }
        });

      await this.toastService.showSuccess('¡Pago realizado exitosamente!');
      this.generateNewPayment();
      this.loadRecentTransactions(user.uid);

    } catch (error) {
      await this.notificationService.vibrateError();
      await this.toastService.showError('Error al procesar el pago');
    } finally {
      this.isProcessing = false;
      await this.loadingService.hide();
    }
  }

  goToAddCard(): void { this.router.navigate(['/cards/add']); }
  goBack(): void { this.router.navigate(['/home']); }
}