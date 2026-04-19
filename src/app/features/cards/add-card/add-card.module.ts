import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { AddCardPage } from './add-card.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AddCardPage }
];

@NgModule({
  imports: [
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddCardPage]
})
export class AddCardPageModule {}