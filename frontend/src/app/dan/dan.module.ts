import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardComponent } from './containers/wizard/wizard.component';
import { DanRoutingModule } from './dan.routing.module';
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
import { MasterDataFormComponent } from './components/master-data-form/master-data-form.component';
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
import { SavedIndicatorComponent } from '../shared/standalone/wizard/saved-indicator.component';

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
    MatRadioModule,
    TitleWithContentComponent,
    WizardSidebarLayoutComponent,
    SavedIndicatorComponent
  ]
})
export class DanModule {}
