import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyCop', standalone: false }) 
export class CurrencyCopPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined) return '$0';
    return value.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    });
  }
}