import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClearingRoutingModule } from './clearing.routing.module';
import { OrganisationListComponent } from './organisation-list/organisation-list.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { OrganisationCardComponent } from './organisation-card/organisation-card.component';
import { MatMenuModule } from '@angular/material/menu';
import { DuplicateComponent } from './duplicate/duplicate.component';
import { FeedbackHistoryComponent } from './feedback-history/feedback-history.component';
import { DuplicateEntryComponent } from './duplicate-entry/duplicate-entry.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
