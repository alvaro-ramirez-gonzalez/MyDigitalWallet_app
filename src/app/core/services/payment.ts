import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore';
import { TransactionModel } from '../models/transaction.model';
import { Observable } from 'rxjs';
import { faker } from '@faker-js/faker';

@Injectable({ providedIn: 'root' })
export class PaymentService {

  constructor(private firestoreService: FirestoreService) {}


  generateFakePayment(): { merchant: string; amount: number } {
    return {
      merchant: faker.company.name(),
      amount: parseFloat(faker.finance.amount({ min: 5000, max: 500000, dec: 0 }))
    };
  }

  async processPayment(userId: string, cardId: string, merchant: string, amount: number): Promise<string> {
    const transaction: Omit<TransactionModel, 'id'> = {
      userId,
      cardId,
      merchant,
      amount,
      date: new Date(),
      status: 'SUCCESS'
    };
    const ref = await this.firestoreService.addDocument(`users/${userId}/transactions`, transaction);
    return ref.id;
  }

  getTransactions(userId: string): Observable<TransactionModel[]> {
    return this.firestoreService.getCollection<TransactionModel>(
      `users/${userId}/transactions`,
      this.firestoreService.orderByClause('date', 'desc')
    );
  }

  getTransactionsByCard(userId: string, cardId: string): Observable<TransactionModel[]> {
    return this.firestoreService.getCollection<TransactionModel>(
      `users/${userId}/transactions`,
      this.firestoreService.whereClause('cardId', '==', cardId),
      this.firestoreService.orderByClause('date', 'desc')
    );
  }

  getTransactionsByDate(userId: string, date: Date): Observable<TransactionModel[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.firestoreService.getCollection<TransactionModel>(
      `users/${userId}/transactions`,
      this.firestoreService.whereClause('date', '>=', start),
      this.firestoreService.whereClause('date', '<=', end),
      this.firestoreService.orderByClause('date', 'desc')
    );
  }

  updateEmoji(userId: string, transactionId: string, emoji: string): Promise<void> {
    return this.firestoreService.updateDocument(
      `users/${userId}/transactions/${transactionId}`,
      { emoji }
    );
  }
}