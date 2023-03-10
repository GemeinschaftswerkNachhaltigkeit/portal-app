import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganisationComponent } from './organisation/organisation.component';
import { SignUpRoutingModule } from './sign-up.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserFormComponent } from './forms/user-form/user-form.component';
import { OrganisationFormComponent } from './forms/organisation-form/organisation-form.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { TopicsFormComponent } from './forms/topics-form/topics-form.component';
import { ExternalLinksFormComponent } from './forms/external-links-form/external-links-form.component';
import { FormStepActionsComponent } from './form-step-actions/form-step-actions.component';
import { SharedModule } from '../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormAdvantagesComponent } from './form-advatages/form-advatages.component';
import { FormFeedbackComponent } from './form-feedback/form-feedback.component';
import { FormStepDescriptionComponent } from './form-step-description/form-step-description.component';
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
import { UploadImageComponent } from './upload-image/upload-image.component';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    FormStepActionsComponent,
    FormAdvantagesComponent,
    FormFeedbackComponent,
    FormStepDescriptionComponent,
    ImportComponent,
    ActivityComponent,
    ActivityFormComponent,
    UploadImageComponent,
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
    DropzoneModule,
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
