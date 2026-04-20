      import { Component, Input, Output, EventEmitter } from '@angular/core';
      import { CardModel } from '../../../core/models/card.model';

      @Component({
        selector: 'app-card',
        templateUrl: './card.component.html',
        styleUrls: ['./card.component.scss'],
        standalone: false
      })
      export class CardComponent {
        @Input() card!: CardModel;
        @Input() isSelected = false;
        @Output() deleteCard = new EventEmitter<CardModel>();
        @Output() editCard = new EventEmitter<CardModel>();

        
        onDelete(event: Event): void {
          event.stopPropagation(); 
          this.deleteCard.emit(this.card);
        }

        onEdit(event: Event): void {
          event.stopPropagation(); 
          this.editCard.emit(this.card);
        }
      }