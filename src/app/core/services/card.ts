import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore';
import { CardModel, CardBrand } from '../models/card.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CardService {

  constructor(private firestoreService: FirestoreService) {}

  validateLuhn(cardNumber: string): boolean {
    const num = cardNumber.replace(/\s/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  }

  detectBrand(cardNumber: string): CardBrand {
    const num = cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'VISA';

    const prefix = parseInt(num.substring(0, 4), 10);
    const prefix2 = parseInt(num.substring(0, 2), 10);

    if ((prefix2 >= 51 && prefix2 <= 55) || (prefix >= 2221 && prefix <= 2720)) {
      return 'MASTERCARD';
    }

    return 'UNKNOWN';
  }


  formatCardNumber(value: string): string {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  }


  formatExpiration(value: string): string {
    const clean = value.replace(/\D/g, '');
    if (clean.length >= 2) {
      return clean.substring(0, 2) + '/' + clean.substring(2, 4);
    }
    return clean;
  }

  
  getCards(userId: string): Observable<CardModel[]> {
    return this.firestoreService.getCollection<CardModel>(
      `users/${userId}/cards`,
      this.firestoreService.orderByClause('createdAt', 'desc')
    );
  }

  addCard(userId: string, card: Omit<CardModel, 'id'>): Promise<any> {
    return this.firestoreService.addDocument(`users/${userId}/cards`, card);
  }

  deleteCard(userId: string, cardId: string): Promise<void> {
    return this.firestoreService.deleteDocument(`users/${userId}/cards/${cardId}`);
  }
}