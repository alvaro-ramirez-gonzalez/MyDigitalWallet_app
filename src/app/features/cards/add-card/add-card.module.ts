import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AddCardPageRoutingModule } from './add-card-routing.module';
import { AddCardPage } from './add-card.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [SharedModule, IonicModule, AddCardPageRoutingModule],
  declarations: [AddCardPage]
})
export class AddCardPageModule {}