import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardComponent } from './containers/wizard/wizard.component';
import { ActivityRoutingModule } from './activity.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxTiptapModule } from 'ngx-tiptap';
import { SharedModule } from '../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ExternalLinksFormComponent } from './components/external-links-form/external-links-form.component';
import { ActionsComponent } from './components/actions/actions.component';
import { MatButtonModule } from '@angular/material/button';
import { StateInfoComponent } from './components/state-info/state-info.component';
import { ImagesFormComponent } from './components/images-form/images-form.component';
import { TopicsFormComponent } from './components/topics-form/topics-form.component';
import { MatRadioModule } from '@angular/material/radio';
import { TitleWithContentComponent } from '../shared/standalone/base/title-with-text.component';
import { WizardSidebarLayoutComponent } from '../shared/standalone/wizard/wizard-sidebar-layout/wizard-sidebar-layout.component';
import { MasterDataFormComponent } from './components/master-data-form/master-data-form.component';
import { SavedIndicatorComponent } from '../shared/standalone/wizard/saved-indicator.component';
import { AlertComponent } from '../shared/standalone/base/alert.component';
import { CharCountComponent } from '../shared/standalone/base/char-count.component';
import { ContentWrapperComponent } from '../shared/standalone/layout/content-wrapper.component';
import { HtmlWrapperComponent } from '../shared/standalone/base/html-wrapper.component';
import { SpinnerComponent } from '../shared/standalone/base/spinner.component';
import { FormFieldErrorComponent } from '../shared/standalone/form/form-field-error/form-field-error.component';
import { UploadImageComponent } from '../shared/standalone/form/upload-image/upload-image.component';
import { AddressControlsComponent } from '../shared/standalone/form/address-control/address-controls.component';
import { ThematicFocusControlComponent } from '../shared/standalone/form/thematic-focus-control.component';
import { ValidCheckComponent } from '../shared/standalone/form/valid-check.component';
import { ContactControlsComponent } from '../shared/standalone/form/contact-controls/contact-controls.component';
import { TiptapMenuBarComponent } from '../shared/standalone/form/tiptap-menu-bar.component';
import { FormAdvantagesComponent } from '../shared/standalone/wizard/form-advatages.component';
import { FormStepActionsComponent } from '../shared/standalone/wizard/form-step-actions.component';
import { FormStepDescriptionComponent } from '../shared/standalone/wizard/form-step-description.component';
import { FeatureComponent } from '../shared/standalone/feature/feature.component';

@NgModule({
  declarations: [
    WizardComponent,
    MasterDataFormComponent,
    ExternalLinksFormComponent,
    ActionsComponent,
    StateInfoComponent,
    ImagesFormComponent,
    TopicsFormComponent
  ],
  imports: [
    CommonModule,
    ActivityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatStepperModule,
    TranslateModule,
    SharedModule,
    DropzoneModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    NgxTiptapModule,
    MatTooltipModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    TitleWithContentComponent,
    WizardSidebarLayoutComponent,
    SavedIndicatorComponent,
    AlertComponent,
    CharCountComponent,
    ContentWrapperComponent,
    HtmlWrapperComponent,
    SpinnerComponent,
    FormFieldErrorComponent,
    UploadImageComponent,
    AddressControlsComponent,
    ThematicFocusControlComponent,
    ValidCheckComponent,
    ContactControlsComponent,
    TiptapMenuBarComponent,
    FormStepActionsComponent,
    FormStepDescriptionComponent,
    FormAdvantagesComponent,
    FeatureComponent
  ]
})
export class ActivityModule {}
