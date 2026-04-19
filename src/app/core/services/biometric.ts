import { Injectable } from '@angular/core';
import { NativeBiometric, BiometricOptions } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class BiometricService {

  private readonly SERVER = 'mydigitalwallet.app';

  async isAvailable(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const result = await NativeBiometric.isAvailable();
      return result.isAvailable;
    } catch {
      return false;
    }
  }

  async verify(title: string = 'Verificar identidad'): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return true;
    try {
      const options: BiometricOptions = {
        reason: title,
        title,
        subtitle: 'Usa tu huella o FaceID',
        negativeButtonText: 'Cancelar',
        useFallback: true
      };
      await NativeBiometric.verifyIdentity(options);
      return true;
    } catch {
      return false;
    }
  }

  async saveCredentials(username: string, password: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    await NativeBiometric.setCredentials({
      username,
      password,
      server: this.SERVER
    });
  }

  async getCredentials(): Promise<{ username: string; password: string } | null> {
    if (!Capacitor.isNativePlatform()) return null;
    try {
      const credentials = await NativeBiometric.getCredentials({
        server: this.SERVER
      });
      return credentials;
    } catch {
      return null;
    }
  }

  async deleteCredentials(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await NativeBiometric.deleteCredentials({ server: this.SERVER });
    } catch {}
  }
}