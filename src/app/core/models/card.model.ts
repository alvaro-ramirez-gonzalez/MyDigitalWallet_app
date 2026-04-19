export type CardBrand = 'VISA' | 'MASTERCARD' | 'UNKNOWN';

export interface CardModel {
  id?: string;
  userId: string;
  cardholderName: string;
  last4: string;
  expiration: string;
  brand: CardBrand;
  color?: string;
  createdAt: Date;
}