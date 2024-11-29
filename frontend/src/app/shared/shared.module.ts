import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldErrorComponent } from './components/form/form-field-error/form-field-error.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertComponent } from './components/base/alert.component';
import { RouterModule } from '@angular/router';
import { ActionComponent } from './components/base/action.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { HtmlWrapperComponent } from './components/base/html-wrapper.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeadingComponent } from './components/base/heading.component';
import { ExpiredBadgeComponent } from './components/base/badges/expired-badge.component';
import { OutlinedIconComponent } from './components/base/outlined-icon.component';
import { LabelComponent } from './components/base/label.component';
import { CardLabelComponent } from './components/cards/card-label.component';
import { ContentRowComponent } from './components/base/content-row.component';
import { CardLogoComponent } from './components/cards/card-logo.component';
import { NewBadgeComponent } from './components/base/badges/new-badge.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ContentWrapperComponent } from './components/layout/content-wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    FormsModule,
    MatStepperModule,
    MatTooltipModule,
    DropzoneModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSidenavModule,
    CdkMenuModule,
    HeadingComponent,
    ExpiredBadgeComponent,
    OutlinedIconComponent,
    ActionComponent,
    AlertComponent,
    LabelComponent,
    CardLabelComponent,
    ContentRowComponent,
    CardLogoComponent,
    NewBadgeComponent,
    HtmlWrapperComponent,
    ContentWrapperComponent,
    FormFieldErrorComponent
  ],
  exports: [CommonModule, TranslateModule]
})
export class SharedModule {}
