/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { DirectusService } from 'src/app/shared/services/directus.service';

export type SignUpOrgContent = {
  advantages: string;
  completedMessage: string;
  completedMessageTitle?: string;
  completedMessageVerifyContact: string;
  completedMessageVerifyContactTitle?: string;
  stepDescriptions: { description: string }[];
};

export type SignUpActivityContent = {
  advantages: string;
  completedMessage: string;
  stepDescriptions: { description: string }[];
};

export type DanContent = {
  advantages: string;
  completedMessage: string;
  stepDescriptions?: { description: string }[];
};

export type SearchContent = {
  titel_line_1: string;
  titel_line_2: string;
  contet: string;
  organisation_info_text: string;
  event_info_text: string;
  marketplace_info_text: string;
};

export type ImportOrgContent = {
  description: string;
  denyCompleteMessage: string;
};

export type ContactInviteContent = {
  allowed: string;
  denied: string;
  invalid: string;
};

@Injectable({
  providedIn: 'root'
})
export class DirectusContentService {
  orgContentSubject = new ReplaySubject<SignUpOrgContent | null>();
  orgContent$ = this.orgContentSubject.asObservable();

  orgImportContentSubject = new ReplaySubject<ImportOrgContent | null>();
  orgImportContent$ = this.orgImportContentSubject.asObservable();

  activityContentSubject = new ReplaySubject<SignUpActivityContent | null>();
  activityContent$ = this.activityContentSubject.asObservable();

  danContentSubject = new ReplaySubject<DanContent | null>();
  danContent$ = this.danContentSubject.asObservable();

  contactInviteSubject = new ReplaySubject<ContactInviteContent | null>();
  contactInvite$ = this.contactInviteSubject.asObservable();

  searchContent = signal<SearchContent | null>(null);

  constructor(
    private translate: TranslateService,
    private directusService: DirectusService
  ) {
    translate.onLangChange.subscribe(() => {
      this.getSignUpOrganisationtTranslations();
      this.getImportDescisionTranslations();
      this.getSignUpActivityTranslations();
      this.getDanTranslations();
      this.getSearchTranslations();
    });
  }

  public async getSignUpOrganisationtTranslations() {
    try {
      const content =
        await this.directusService.getContentItemForCurrentLang<SignUpOrgContent>(
          'SignUpOrganisation_translations'
        );
      this.orgContentSubject.next(content);
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }

  public async getImportDescisionTranslations(replacements = { orgname: '' }) {
    try {
      const response =
        await this.directusService.getContentItemForCurrentLang<ImportOrgContent>(
          'ImportOrganisation_translations'
        );

      let content: ImportOrgContent;
      if (response) {
        content = response;

        content.denyCompleteMessage = content.denyCompleteMessage.replace(
          '{{orgname}}',
          replacements.orgname
        );

        content.description = content.description.replace(
          '{{orgname}}',
          replacements.orgname
        );

        this.orgImportContentSubject.next(content);
      }
    } catch (e) {
      //   this.orgUpdateStateSubject.next({ type: 'loadError', error: true });
      console.error('loadError', e);
      return;
    }
  }

  public async getContactInviteTranslations(replacements = { orgname: '' }) {
    try {
      const response =
        await this.directusService.getContentItemForCurrentLang<ContactInviteContent>(
          'ContactInvite_translations'
        );

      let content: ContactInviteContent;
      if (response) {
        content = response;

        content.allowed = content.allowed.replace(
          '{{orgname}}',
          replacements.orgname
        );
        content.denied = content.denied.replace(
          '{{orgname}}',
          replacements.orgname
        );
        content.invalid = content.invalid.replace(
          '{{orgname}}',
          replacements.orgname
        );

        this.contactInviteSubject.next(content);
      }
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }

  public async getSignUpActivityTranslations() {
    try {
      const response =
        await this.directusService.getContentItemForCurrentLang<SignUpActivityContent>(
          'SignUpActivity_translations'
        );

      this.activityContentSubject.next(response);
      return response;
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }

  public async getDanTranslations() {
    try {
      const response =
        await this.directusService.getContentItemForCurrentLang<DanContent>(
          'dan_wizard_translations'
        );

      this.danContentSubject.next(response);
      return response;
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }

  public async getSearchTranslations() {
    try {
      const response =
        await this.directusService.getContentItemForCurrentLang<SearchContent>(
          'search_translations'
        );

      this.searchContent.set(response);
      return response;
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }
}
