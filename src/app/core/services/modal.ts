import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ModalService {

  constructor(private modalController: ModalController) {}

  async open(component: any, props?: any): Promise<any> {
    const modal = await this.modalController.create({
      component,
      componentProps: props,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.75
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    return data;
  }

  async dismiss(data?: any): Promise<void> {
    await this.modalController.dismiss(data);
  }
}