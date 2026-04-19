import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { CardService } from '../../core/services/card';
import { PaymentService } from '../../core/services/payment';
import { ToastService } from '../../core/services/toast';
import { ModalService } from '../../core/services/modal';
import { DialogService } from '../../core/services/dialog'; 
import { UserModel } from '../../core/models/user.model';
import { CardModel } from '../../core/models/card.model';
import { TransactionModel } from '../../core/models/transaction.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit, OnDestroy {

  user: UserModel | null = null;
  cards: CardModel[] = [];
  transactions: TransactionModel[] = [];
  selectedCard: CardModel | null = null;

  totalBalance = 0;
  balanceVisible = true;
  isLoadingCards = true;
  isLoadingTx = true;
  showCalendar = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private cardService: CardService,
    private paymentService: PaymentService,
    private toastService: ToastService,
    private modalService: ModalService,
    private dialogService: DialogService
    
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get userName(): string {
    return this.user?.nombre || 'Usuario';
  }

  get userInitials(): string {
    const n = this.user?.nombre?.[0] || '';
    const a = this.user?.apellido?.[0] || '';
    return (n + a).toUpperCase();
  }

  private loadUserProfile(): void {
    this.userService.getCurrentUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: UserModel | null) => {
        this.user = user;
        if (user) {
          this.loadCards(user.uid);
          this.loadTransactions(user.uid);
        }
      });
  }

  private loadCards(uid: string): void {
    this.isLoadingCards = true;
    this.cardService.getCards(uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cards: CardModel[]) => {
        this.cards = cards;
        this.isLoadingCards = false;
        if (cards.length > 0 && !this.selectedCard) {
          this.selectedCard = cards[0];
        }
      });
  }

  private loadTransactions(uid: string): void {
    this.isLoadingTx = true;
    this.paymentService.getTransactions(uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactions: TransactionModel[]) => {
        this.transactions = transactions;
        this.totalBalance = transactions
          .filter((t: TransactionModel) => t.status === 'SUCCESS')
          .reduce((acc: number, t: TransactionModel) => acc - t.amount, 50000000);
        this.isLoadingTx = false;
      });
  }

  selectCard(card: CardModel): void {
    this.selectedCard = card;
    if (this.user) {
      this.isLoadingTx = true;
      this.paymentService.getTransactionsByCard(this.user.uid, card.id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe((transactions: TransactionModel[]) => {
          this.transactions = transactions;
          this.isLoadingTx = false;
        });
    }
  }

  filterByDate(date: Date): void {
    if (!this.user) return;
    this.isLoadingTx = true;
    this.paymentService.getTransactionsByDate(this.user.uid, date)
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactions: TransactionModel[]) => {
        this.transactions = transactions;
        this.isLoadingTx = false;
        this.showCalendar = false;
      });
  }

  onEmojiUpdated(event: { id: string; emoji: string }): void {
    if (!this.user) return;
    this.paymentService.updateEmoji(this.user.uid, event.id, event.emoji);
  }

  async onLogout(): Promise<void> {
    const confirmed = await this.dialogService.confirm(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?'
    );
    if (!confirmed) return;

    try {
      await this.authService.logout();
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    } catch (error) {
      await this.toastService.showError('Error al cerrar sesión');
    }
  }

  toggleBalance(): void { this.balanceVisible = !this.balanceVisible; }
  toggleCalendar(): void { this.showCalendar = !this.showCalendar; }

  goToPayment(): void { this.router.navigate(['/payment']); }
  goToAddCard(): void { this.router.navigate(['/cards/add']); }
  goToProfile(): void { this.toastService.showInfo('Perfil próximamente'); }
  onRecharge(): void { this.toastService.showInfo('Recarga próximamente'); }
  onNotification(): void { this.toastService.showInfo('Notificaciones'); }
}