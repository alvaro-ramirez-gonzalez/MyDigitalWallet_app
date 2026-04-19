import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardService } from '../../../core/services/card';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';
import { LoadingService } from '../../../core/services/loading';
import { NotificationService } from '../../../core/services/notification';
import { CardBrand } from '../../../core/models/card.model';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
  standalone: false 
})
export class AddCardPage {

  cardForm: FormGroup;
  brand: CardBrand = 'UNKNOWN';
  isLuhnValid = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cardService: CardService,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {
    this.cardForm = this.fb.group({
      cardNumber:     ['', [Validators.required, Validators.minLength(19)]],
      cardholderName: ['', Validators.required],
      expiration:     ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv:            ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
    });
  }

  get cardBrandClass(): string {
    if (this.brand === 'VISA') return 'visa-card';
    if (this.brand === 'MASTERCARD') return 'mastercard-card';
    return 'default-card';
  }

  get cardNumberDisplay(): string {
    const value = this.cardForm.get('cardNumber')?.value || '';
    const clean = value.replace(/\s/g, '');
    const padded = clean.padEnd(16, '•');
    return padded.replace(/(.{4})/g, '$1 ').trim();
  }

  onCardNumberInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    const formatted = this.cardService.formatCardNumber(value);
    this.cardForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
    event.target.value = formatted;

    this.brand = this.cardService.detectBrand(value);
    this.isLuhnValid = value.length === 16 ? this.cardService.validateLuhn(value) : false;
  }

  onExpirationInput(event: any): void {
    const formatted = this.cardService.formatExpiration(event.target.value);
    this.cardForm.get('expiration')?.setValue(formatted, { emitEvent: false });
    event.target.value = formatted;
  }

  onNameInput(event: any): void {
    const upper = event.target.value.toUpperCase();
    this.cardForm.get('cardholderName')?.setValue(upper, { emitEvent: false });
    event.target.value = upper;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.cardForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  async onAddCard(): Promise<void> {
    if (this.cardForm.invalid || !this.isLuhnValid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser;
    if (!user) return;

    this.isLoading = true;

    try {
      await this.loadingService.show('Agregando tarjeta...');
      const { cardNumber, cardholderName, expiration } = this.cardForm.value;
      const clean = cardNumber.replace(/\s/g, '');

      await this.cardService.addCard(user.uid, {
        userId: user.uid,
        cardholderName,
        last4: clean.slice(-4),
        expiration,
        brand: this.brand,
        color: this.brandColor,
        createdAt: new Date()
      });

      await this.notificationService.vibrateSuccess();
      await this.toastService.showSuccess('¡Tarjeta agregada exitosamente!');
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error) {
      await this.toastService.showError('Error al agregar la tarjeta');
      await this.notificationService.vibrateError();
    } finally {
      this.isLoading = false;
      await this.loadingService.hide();
    }
  }

  get brandColor(): string {
    if (this.brand === 'VISA') return '#1a237e';
    if (this.brand === 'MASTERCARD') return '#b71c1c';
    return '#6C63FF';
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}