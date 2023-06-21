import { Injectable } from '@angular/core';

export interface MatomoTag {
  event: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class MatomoTagManagerService {
  /**
   * Send a new tag to MTM Container
   * @param tag The tag
   */
  sendTag(tag: MatomoTag): void {
    const dataLayer = this.getDataLayer();
    dataLayer.push(tag);
  }

  /**
   * Return the datalayer (by default in _mtm variable)
   */
  private getDataLayer(): any {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window['_mtm'] = window['_mtm'] || [];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return window['_mtm'];
  }
}
