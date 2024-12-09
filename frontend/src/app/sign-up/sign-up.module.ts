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
import { TopicsFormComponent } from './forms/topics-form/topics-form.component';
import { ExternalLinksFormComponent } from './forms/external-links-form/external-links-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormFeedbackComponent } from './form-feedback/form-feedback.component';
import { ImportComponent } from './import/import.component';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactInviteComponent } from './contact-invite/contact-invite.component';
import { MatIconModule } from '@angular/material/icon';
import { OrganisationSuccessPageComponent } from './organisation-success-page/organisation-success-page.component';
import { OrgaMembershipComponent } from './orga-membership/orga-membership.component';
import { AdminWarningComponent } from './admin-warning/admin-warning.component';
import { TitleWithContentComponent } from '../shared/components/base/title-with-text.component';
import { WizardSidebarLayoutComponent } from '../shared/components/wizard/wizard-sidebar-layout/wizard-sidebar-layout.component';
import { MatRadioModule } from '@angular/material/radio';
import { OutlinedIconComponent } from '../shared/components/base/outlined-icon.component';
import { AlertComponent } from '../shared/components/base/alert.component';
import { CharCountComponent } from '../shared/components/base/char-count.component';
import { ContentWrapperComponent } from '../shared/components/layout/content-wrapper.component';
import { NotificationPageComponent } from '../shared/components/layout/notification-page/notification-page.component';
import { HtmlWrapperComponent } from '../shared/components/base/html-wrapper.component';
import { SpinnerComponent } from '../shared/components/base/spinner.component';
import { FormFieldErrorComponent } from '../shared/components/form/form-field-error/form-field-error.component';
import { UploadImageComponent } from '../shared/components/form/upload-image/upload-image.component';
import { ValidCheckComponent } from '../shared/components/form/valid-check.component';
import { ThematicFocusControlComponent } from '../shared/components/form/thematic-focus-control.component';
import { ContactControlsComponent } from '../shared/components/form/contact-controls/contact-controls.component';
import { TiptapMenuBarComponent } from '../shared/components/form/tiptap-menu-bar.component';
import { FormStepActionsComponent } from '../shared/components/wizard/form-step-actions.component';
import { FormStepDescriptionComponent } from '../shared/components/wizard/form-step-description.component';
import { FormAdvantagesComponent } from '../shared/components/wizard/form-advatages.component';

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
    FormFeedbackComponent,
    ImportComponent,
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    NgxTiptapModule,
    MatTooltipModule,
    MatIconModule,
    MatRadioModule,
    TitleWithContentComponent,
    WizardSidebarLayoutComponent,
    OutlinedIconComponent,
    AlertComponent,
    CharCountComponent,
    ContentWrapperComponent,
    NotificationPageComponent,
    HtmlWrapperComponent,
    SpinnerComponent,
    UploadImageComponent,
    FormFieldErrorComponent,
    ValidCheckComponent,
    ThematicFocusControlComponent,
    ContactControlsComponent,
    TiptapMenuBarComponent,
    FormStepActionsComponent,
    FormStepDescriptionComponent,
    FormAdvantagesComponent,
    MatIconModule,
    OutlinedIconComponent
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
