import { Injectable } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema } from '@capacitor/push-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { HttpService } from './http';
import { UserService } from './user';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private jwtToken: string = '';

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  async initialize(): Promise<void> {
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
      console.log('Notificación recibida:', notification);
    });
  }

  async authenticateNotificationService(email: string, password: string): Promise<void> {
    this.httpService.login(email, password).subscribe(res => {
      this.jwtToken = res.token;
    });
  }

  async sendPaymentNotification(fcmToken: string, merchant: string, amount: number): Promise<void> {
    if (!this.jwtToken) return;


    await Haptics.impact({ style: ImpactStyle.Medium });

    this.httpService.sendNotification(
      this.jwtToken,
      fcmToken,
      'Pago Exitoso',
      `Has realizado un pago de $${amount.toLocaleString('es-CO')} en ${merchant}`
    ).subscribe();
  }

  async vibrateSuccess(): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  async vibrateError(): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  }
}