import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { CardComponent } from './components/card/card.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionItemComponent } from './components/transaction-item/transaction-item.component';
import { BalanceDisplayComponent } from './components/balance-display/balance-display.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { PaymentSimulatorComponent } from './components/payment-simulator/payment-simulator.component';
import { SkeletonLoadingComponent } from './components/skeleton-loading/skeleton-loading.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CardNumberPipe } from './pipes/card-number.pipe';
import { CurrencyCopPipe } from './pipes/currency-cop.pipe';

const COMPONENTS = [
  CardComponent,
  TransactionListComponent,
  TransactionItemComponent,
  BalanceDisplayComponent,
  QuickActionsComponent,
  CustomInputComponent,
  PaymentSimulatorComponent,
  SkeletonLoadingComponent,
  CalendarComponent,
  CardNumberPipe,
  CurrencyCopPipe,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    PickerModule,
  ],
  exports: [
    ...COMPONENTS,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    PickerModule,
  ]
})
export class SharedModule {}