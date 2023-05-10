import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClearingRoutingModule } from './clearing.routing.module';
import { OrganisationListComponent } from './organisation-list/organisation-list.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { SharedModule } from '../shared/shared.module';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { OrganisationCardComponent } from './organisation-card/organisation-card.component';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { DuplicateComponent } from './duplicate/duplicate.component';
import { FeedbackHistoryComponent } from './feedback-history/feedback-history.component';
import { DuplicateEntryComponent } from './duplicate-entry/duplicate-entry.component';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';

@NgModule({
  declarations: [
    OrganisationListComponent,
    OrganisationCardComponent,
    DuplicateComponent,
    FeedbackHistoryComponent,
    DuplicateEntryComponent
  ],
  imports: [
    CommonModule,
    ClearingRoutingModule,
    TranslateModule,
    MatButtonModule,
    MatPaginatorModule,
    SharedModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatSlideToggleModule
  ]
})
export class ClearingModule {}
