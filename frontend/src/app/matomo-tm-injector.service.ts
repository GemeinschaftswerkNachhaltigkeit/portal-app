import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Currently unused
 */
@Injectable({
  providedIn: 'root'
})
export class MatomoInjectorService {
  scriptLoaded = false;

  constructor() {
    this.initMtm();
  }

  initMtm(): void {
    if (this.scriptLoaded) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mtm = (window['_mtm'] = window['_mtm'] || []);
    mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });

    const { host, containerId } = {
      host: environment.matomoUrl,
      containerId: environment.matomoTagManagerContainerId
    };
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = `${host}/js/container_${containerId}.js`;
    const scripts = document.getElementsByTagName('script');
    const s = scripts[scripts.length - 1];
    s.parentNode?.insertBefore(script, s);

    this.scriptLoaded = true;
  }
}
