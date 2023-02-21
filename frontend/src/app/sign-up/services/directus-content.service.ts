/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { FieldFilter } from '@directus/sdk';
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
  /* private contentIdsSubject = new ReplaySubject<
    [{ SignUpFormKey: string; translations: number }]
  >();
  private contentIds$ = this.contentIdsSubject.asObservable();
*/
  orgContentSubject = new ReplaySubject<SignUpOrgContent>();
  orgContent$ = this.orgContentSubject.asObservable();

  orgImportContentSubject = new ReplaySubject<ImportOrgContent>();
  orgImportContent$ = this.orgImportContentSubject.asObservable();

  activityContentSubject = new ReplaySubject<SignUpActivityContent>();
  activityContent$ = this.activityContentSubject.asObservable();

  contactInviteSubject = new ReplaySubject<ContactInviteContent>();
  contactInvite$ = this.contactInviteSubject.asObservable();

  constructor(
    private translate: TranslateService,
    private directusService: DirectusService
  ) {
    // this.getContentIds();
    translate.onLangChange.subscribe(() => {
      this.getSignUpOrganisationtTranslations();
      this.getImportDescisionTranslations();
      this.getSignUpActivityTranslations();
      //this.getContactInviteTranslations({ orgname: '' });
      //  this.updateCalendarTranslation(event);
    });
  }

  public async getSignUpOrganisationtTranslations() {
    try {
      const response = await this.directusService.directus
        .items('SignUpOrganisation_translations')
        .readByQuery({
          //   fields: ['participation_declaration', 'languages_id'],
          filter: {
            languages_code: this.getLangIso() //'en-US'
          }
        });
      this.orgContentSubject.next(response.data![0] as SignUpOrgContent);
      return response;
    } catch (e) {
      //   this.orgUpdateStateSubject.next({ type: 'loadError', error: true });
      console.error('loadError', e);
      return;
    }
  }

  public async getImportDescisionTranslations(replacements = { orgname: '' }) {
    try {
      const response = await this.directusService.directus
        .items('ImportOrganisation_translations')
        .readByQuery({
          //   fields: ['participation_declaration', 'languages_id'],
          filter: {
            languages_code: this.getLangIso() //'en-US'
          }
        });

      let content: ImportOrgContent;
      if (response && response.data && response.data[0]) {
        content = response.data[0] as ImportOrgContent;

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

      return response;
    } catch (e) {
      //   this.orgUpdateStateSubject.next({ type: 'loadError', error: true });
      console.error('loadError', e);
      return;
    }
  }

  public async getContactInviteTranslations(replacements = { orgname: '' }) {
    try {
      const response = await this.directusService.directus
        .items('ContactInvite_translations')
        .readByQuery({
          filter: {
            languages_code: this.getLangIso()
          }
        });

      let content: ContactInviteContent;
      if (response && response.data && response.data[0]) {
        content = response.data[0] as ContactInviteContent;

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
      return response;
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }

  public async getSignUpActivityTranslations() {
    try {
      const response = await this.directusService.directus
        .items('SignUpActivity_translations') // TODO
        .readByQuery({
          filter: {
            languages_code: this.getLangIso() //'en-US'
          }
        });
      this.activityContentSubject.next(
        response.data![0] as SignUpActivityContent
      );
      return response;
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }

  private getLangIso(): FieldFilter<string> {
    const currentLang =
      this.translate.currentLang || this.translate.defaultLang;
    return currentLang === 'de' ? 'de-DE' : 'en-US';
  }
}
