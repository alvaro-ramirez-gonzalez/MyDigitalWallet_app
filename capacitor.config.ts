import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mydigitalwallet.app',
  appName: 'MyDigitalWallet',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '574202598990-a324nd7a8v2ikolu16e35oohgqvh2114.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;