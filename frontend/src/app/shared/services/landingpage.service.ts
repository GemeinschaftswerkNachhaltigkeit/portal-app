import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { DirectusService } from './directus.service';

@Injectable({
  providedIn: 'root'
})
export class LandingpageService {
  constructor(
    private translate: TranslateService,
    private directusService: DirectusService
  ) {}

  getPrivacyPolicyUrl(): string {
    return `${environment.landingPageUrl}${this.getLangPathPrefix()}/privacy`;
  }

  getImprintUrl(): string {
    return `${environment.landingPageUrl}${this.getLangPathPrefix()}/imprint`;
  }

  getRoadmapUrl(): string {
    return `${environment.landingPageUrl}${this.getLangPathPrefix()}/roadmap`;
  }

  getPartnerUrl(): string {
    return `${environment.landingPageUrl}${this.getLangPathPrefix()}/partner`;
  }

  getAboutUrl(): string {
    return `${environment.landingPageUrl}${this.getLangPathPrefix()}/about`;
  }

  getBaseUrl(): string {
    return `${environment.landingPageUrl}${this.getLangPathPrefix()}`;
  }

  getProjectNUrl(): string {
    return `${
      environment.landingPageUrl
    }${this.getLangPathPrefix()}/projekt-nachhaltigkeit`;
  }

  getDanUrl(): string {
    return `${
      environment.landingPageUrl
    }${this.getLangPathPrefix()}/aktions-tage`;
  }

  async getParticipationDeclarationUrl(): Promise<string> {
    const url = await this.directusService.getParticipationDeclarationUrl();
    return url || '';
  }

  private getLangPathPrefix() {
    const currentLang =
      this.translate.currentLang || this.translate.defaultLang;
    return currentLang !== 'de' ? '/' + currentLang : '';
  }
}
