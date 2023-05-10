import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardComponent } from './containers/wizard/wizard.component';
import { DanRoutingModule } from './dan.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxTiptapModule } from 'ngx-tiptap';
import { SharedModule } from '../shared/shared.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MasterDataFormComponent } from './components/master-data-form/master-data-form.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ExternalLinksFormComponent } from './components/external-links-form/external-links-form.component';
import { ActionsComponent } from './components/actions/actions.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { StateInfoComponent } from './components/state-info/state-info.component';
import { ImagesFormComponent } from './components/images-form/images-form.component';
import { WizardLayoutComponent } from './components/wizard-layout/wizard-layout.component';
import { TopicsFormComponent } from './components/topics-form/topics-form.component';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';

@NgModule({
  declarations: [
    WizardComponent,
    MasterDataFormComponent,
    ExternalLinksFormComponent,
    ActionsComponent,
    StateInfoComponent,
    ImagesFormComponent,
    WizardLayoutComponent,
    TopicsFormComponent
  ],
  imports: [
    CommonModule,
    DanRoutingModule,
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
    MatRadioModule
  ]
})
export class DanModule {}
