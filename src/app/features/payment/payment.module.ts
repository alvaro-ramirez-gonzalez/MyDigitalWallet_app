import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PaymentPageRoutingModule } from './payment-routing.module';
import { PaymentPage } from './payment.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    IonicModule,
    PaymentPageRoutingModule
  ],
  declarations: [PaymentPage]
})
export class PaymentPageModule {}