import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganisationComponent } from './organisation/organisation.component';
import { SignUpRoutingModule } from './sign-up.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { UserFormComponent } from './forms/user-form/user-form.component';
import { OrganisationFormComponent } from './forms/organisation-form/organisation-form.component';
import { MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { TopicsFormComponent } from './forms/topics-form/topics-form.component';
import { ExternalLinksFormComponent } from './forms/external-links-form/external-links-form.component';
import { SharedModule } from '../shared/shared.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { FormAdvantagesComponent } from './form-advatages/form-advatages.component';
import { FormFeedbackComponent } from './form-feedback/form-feedback.component';
import { ImportComponent } from './import/import.component';
import { ActivityComponent } from './activity/activity.component';
import { ActivityFormComponent } from './forms/activity-form/activity-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  LuxonDateAdapter,
  MatLuxonDateModule,
  MAT_LUXON_DATE_ADAPTER_OPTIONS
} from '@angular/material-luxon-adapter';
import {
  DateAdapter,
  MatDateFormats,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { NgxTiptapModule } from 'ngx-tiptap';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { ContactInviteComponent } from './contact-invite/contact-invite.component';
import { MatIconModule } from '@angular/material/icon';
import { OrganisationSuccessPageComponent } from './organisation-success-page/organisation-success-page.component';
import { OrgaMembershipComponent } from './orga-membership/orga-membership.component';
import { AdminWarningComponent } from './admin-warning/admin-warning.component';

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D'
  },
  display: {
    dateInput: 'dd.LL.yyyy',
    monthYearLabel: 'LLL yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'LLL yyyy'
  }
};

@NgModule({
  declarations: [
    OrganisationComponent,
    UserFormComponent,
    OrganisationFormComponent,
    TopicsFormComponent,
    ExternalLinksFormComponent,
    FormAdvantagesComponent,
    FormFeedbackComponent,
    ImportComponent,
    ActivityComponent,
    ActivityFormComponent,
    ContactInviteComponent,
    OrganisationSuccessPageComponent,
    OrgaMembershipComponent,
    AdminWarningComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    SignUpRoutingModule,
    TranslateModule,
    SharedModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    NgxTiptapModule,
    MatTooltipModule,
    MatIconModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: LuxonDateAdapter },
    {
      provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
      useValue: { firstDayOfWeek: 1 }
    }
  ]
})
export class SignUpModule {}
