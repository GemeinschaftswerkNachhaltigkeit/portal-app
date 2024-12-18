import { enableProdMode } from '@angular/core';

import { environment, overrideEnvironment } from './environments/environment';
import { register } from 'swiper/element/bundle';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
// register Swiper custom elements
register();

(async () => {
  try {
    // Try to fetch the environment from the backend
    const env = await fetch(`${environment.apiUrl}/ui/ui-config`).then((res) =>
      res.json()
    );
    console.log('>>>> UI CONFIG');

    // Override the environment with data from the backend. Use the existing environment as fallback
    overrideEnvironment(Object.assign(environment, env));
  } catch (e) {
    console.error('Unexpected error while loading bootstrap configuration.', e);
  } finally {
    // Bootstrap the Angular application
    if (environment.production) {
      enableProdMode();
    }

    await bootstrapApplication(AppComponent, appConfig).catch((err) =>
      console.error(err)
    );

    // platformBrowserDynamic()
    //   .bootstrapModule(AppModule)
    //   .catch((err) => console.error(err));
  }
})();
