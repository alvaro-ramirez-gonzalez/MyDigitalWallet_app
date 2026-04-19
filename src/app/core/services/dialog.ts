  import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class DialogService {

  constructor(private alertController: AlertController) {}

  async confirm(header: string, message: string): Promise<boolean> {
    return new Promise(async resolve => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          { text: 'Cancelar', role: 'cancel', handler: () => resolve(false) },
          { text: 'Aceptar', role: 'confirm', handler: () => resolve(true) }
        ]
      });
      await alert.present();
    });
  }

  async alert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}