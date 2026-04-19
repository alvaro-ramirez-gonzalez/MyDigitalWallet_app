import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [SharedModule, IonicModule, RegisterPageRoutingModule],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}