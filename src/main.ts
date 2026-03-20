import { bootstrapApplication } from '@angular/platform-browser';
import { APP_INITIALIZER, isDevMode } from '@angular/core';
import { inject } from '@vercel/analytics';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
        inject({ mode: isDevMode() ? 'development' : 'production' });
      },
      multi: true
    }
  ]
})
  .catch((err) => console.error(err));
