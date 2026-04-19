export interface TransactionModel {
  id?: string;
  userId: string;
  cardId: string;
  merchant: string;
  amount: number;
  date: Date;
  emoji?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}