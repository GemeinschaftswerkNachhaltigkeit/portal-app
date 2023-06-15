import { Injectable, Inject } from '@angular/core';
import { MatomoTagManagerConfig } from './matomo-tag-manager.config';

@Injectable({
  providedIn: 'root'
})
export class MatomoInjectorService {
  scriptLoaded = false;

  constructor() {
    this.initMtm();
  }

  /**
   * Initialization of Matomo Tag Manager (MTM)
   * 1. Creation of the html tag to inject Matomo script
   * 2. Pushing init tag required
   */
  initMtm(): void {
    if (this.scriptLoaded) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mtm = (window['_mtm'] = window['_mtm'] || []);
    mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });

    const { host, containerId } = {
      host: 'http://localhost',
      containerId: 'OpLDkCNf'
    };
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = `${host}/js/container_${containerId}.js`;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode?.insertBefore(script, s);

    this.scriptLoaded = true;
  }
}
