import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cardNumber', standalone: false })
export class CardNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const clean = value.replace(/\s/g, '');
    return clean.replace(/(.{4})/g, '$1 ').trim();
  }
}