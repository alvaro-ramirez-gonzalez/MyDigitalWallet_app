import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private loader: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  async show(message: string = 'Cargando...'): Promise<void> {
    this.loader = await this.loadingController.create({
      message,
      spinner: 'crescent',
      backdropDismiss: false
    });
    await this.loader.present();
  }

  async hide(): Promise<void> {
    if (this.loader) {
      await this.loader.dismiss();
      this.loader = null;
    }
  }
}