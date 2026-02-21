import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saumya.humanvsbot',
  appName: 'humanvsbot-frontend',
  webDir: 'dist/humanvsbot-frontend/browser',
  server: {
    url: 'http://10.0.2.2:4200', // 10.0.2.2 is how the emulator connects to your PC's localhost
    cleartext: true
  }
};

export default config;
