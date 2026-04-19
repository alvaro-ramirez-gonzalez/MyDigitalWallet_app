import { Component, Input } from '@angular/core';
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
}