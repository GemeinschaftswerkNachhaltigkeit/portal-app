import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment, overrideEnvironment } from './environments/environment';
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

(async () => {
  try {
    // Try to fetch the environment from the backend
    const env = await fetch(`${environment.apiUrl}/ui/ui-config`).then((res) =>
      res.json()
    );

    // Override the environment with data from the backend. Use the existing environment as fallback
    overrideEnvironment(Object.assign(environment, env));
  } catch (e) {
    console.error('Unexpected error while loading bootstrap configuration.', e);
  } finally {
    // Bootstrap the Angular application
    if (environment.production) {
      enableProdMode();
    }
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  }
})();
