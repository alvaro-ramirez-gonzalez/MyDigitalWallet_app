import { Injectable } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema } from '@capacitor/push-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { HttpService } from './http';
import { UserService } from './user';
import { AuthService } from './auth';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private jwtToken: string = '';

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  async initialize(): Promise<void> {
    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') return;

      await PushNotifications.register();

      PushNotifications.addListener('registration', async (token: Token) => {
        const user = this.authService.currentUser;
        if (user) {
          await this.userService.updateFcmToken(user.uid, token.value);
        }
      });

      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        Haptics.impact({ style: ImpactStyle.Light });
        console.log('Notificación recibida:', notification);
      });
    } catch (e) {
      console.warn('Push initialization skipped (normal en web)');
    }
  }

  async authenticateNotificationService(email: string, password: string): Promise<void> {
    try {
      const res = await firstValueFrom(this.httpService.login(email, password));
      if (res && res.token) {
        this.jwtToken = res.token;
      } else {
        throw new Error('No se recibió token del servidor');
      }
    } catch (error) {
      this.jwtToken = '';
      console.error('Error autenticando en Railway:', error);
    }
  }

  async sendPaymentNotification(fcmToken: string, merchant: string, amount: number): Promise<void> {
    if (!this.jwtToken) {
      console.warn('No hay JWT de Railway. Abortando envío.');
      return;
    }

    try {
      await Haptics.impact({ style: ImpactStyle.Medium });

      await firstValueFrom(
        this.httpService.sendNotification(
          this.jwtToken,
          fcmToken,
          'Pago Exitoso',
          `Has realizado un pago de $${amount.toLocaleString('es-CO')} en ${merchant}`
        )
      );
    } catch (err) {
      console.error('Error al enviar notificación a Railway:', err);
    }
  }

  async vibrateSuccess(): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  async vibrateError(): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  }
}