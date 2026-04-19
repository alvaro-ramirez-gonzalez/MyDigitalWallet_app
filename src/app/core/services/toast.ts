import { Injectable } from '@angular/core';
import { Toast } from '@capacitor/toast';

@Injectable({ providedIn: 'root' })
export class ToastService {

  async showSuccess(message: string): Promise<void> {
    await Toast.show({ text: message, duration: 'short', position: 'bottom' });
  }

  async showError(message: string): Promise<void> {
    await Toast.show({ text: message, duration: 'long', position: 'bottom' });
  }

  async showInfo(message: string): Promise<void> {
    await Toast.show({ text: message, duration: 'short', position: 'top' });
  }
}