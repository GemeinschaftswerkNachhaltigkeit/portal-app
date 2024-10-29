/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import {
  MessageInputDialogComponent,
  MessageInput
} from 'src/app/shared/components/message-input-dialog/message-input-dialog.component';
import { OrganisationStatus } from 'src/app/shared/models/organisation-status';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import {
  defaultPaginatorOptions,
  PageQuerParams
} from 'src/app/shared/models/paging';

import { Feedback } from '../models/feedback';
import { ClearingService } from '../services/clearing.service';

type SidebarContentType = 'duplicates' | 'feedback';

@Component({
  selector: 'app-organisation-list',
  templateUrl: './organisation-list.component.html',
  styleUrls: ['./organisation-list.component.scss']
})
export class OrganisationListComponent {
  public orgData$ = this.clearingService.orgData$;
  orgListPaging$ = this.clearingService.orgListPaging$;
  orgDuplicate$ = this.clearingService.orgDuplicate$;

  isPublishing = false;
  opened = false;

  sortDirection = 'asc';

  showWatingForFeedbackEntries = false;
  selectedOrgId: number | undefined = undefined;
  sidebarContentType: SidebarContentType = 'duplicates';
  orgFeedbackHistory: number | undefined = undefined;

  @ViewChild('sidenav')
  public sidenav: MatSidenav | undefined;

  constructor(
    private clearingService: ClearingService,
    private dialog: MatDialog
  ) {
    this.fetchClearingData();
  }

  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = defaultPaginatorOptions.pageSizeOptions;

  pageChangedHandler(event: PageEvent): void {
    this.fetchClearingData({
      page: event.pageIndex,
      size: event.pageSize
    });
  }

  setSortHandler(direction = 'asc'): void {
    this.sortDirection = direction;
    this.fetchClearingData({ sort: `createdAt,${direction}` });
  }

  toggleShowInFeedbackHandler(): void {
    this.showWatingForFeedbackEntries = !this.showWatingForFeedbackEntries;
    this.fetchClearingData({});
  }

  private fetchClearingData(pagingParams: PageQuerParams = {}): void {
    const paging = this.clearingService.orgListPaging;
    let page = pagingParams.page;
    let size = pagingParams.size;
    let sort = pagingParams.sort;

    if (!page) {
      page = paging.number || 0;
    }
    if (!size) {
      size = paging.size || this.pageSize;
    }
    if (!sort) {
      sort = `createdAt,${this.sortDirection}`;
    }

    this.clearingService
      .getOrganisations(
        {
          page: page,
          size: size,
          sort: sort
        },
        this.showWatingForFeedbackEntries
      )
      .then((nextPage) => {
        if (nextPage?.totalElements == 0) {
          this.closeSidenav();
        }
      });
  }

  async publishOrg(id: number) {
    try {
      this.isPublishing = true;
      await this.clearingService.publishOrganisation(id);
    } finally {
      this.isPublishing = false;
      this.fetchClearingData();
    }
  }

  requireFeedback(id: number, orgName: string) {
    const dialogRef = this.dialog.open(MessageInputDialogComponent, {
      width: '700px',
      data: {
        titleParams: { orgname: orgName },
        translationKeys: {
          title: 'clearing.requireFeedback.dialog.title',
          messageFieldLabel:
            'clearing.requireFeedback.dialog.messageFieldLabel',
          confirmBtn: 'clearing.requireFeedback.dialog.confirmBtn'
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: MessageInput) => {
      if (result) {
        this.clearingService
          .requireFeedbackForOrganisation(id, result.message)
          .finally(() => this.fetchClearingData());
      }
    });
  }

  rejectOrg(id: number, orgName: string) {
    const dialogRef = this.dialog.open(MessageInputDialogComponent, {
      width: '700px',
      data: {
        titleParams: { orgname: orgName },
        translationKeys: {
          title: 'clearing.reject.dialog.title',
          messageFieldLabel: 'clearing.reject.dialog.messageFieldLabel',
          confirmBtn: 'clearing.reject.dialog.confirmBtn'
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: MessageInput) => {
      if (result) {
        this.clearingService
          .rejectOrganisation(id, result.message)
          .finally(() => this.fetchClearingData());
      }
    });
  }

  isAllowedToPublish(state: OrganisationStatus) {
    return this.clearingService.isAllowedToPublish(state);
  }

  isAllowedToRequestFeedback(state: OrganisationStatus) {
    return this.clearingService.isAllowedToRequestFeedback(state);
  }

  isAllowedToReject(state: OrganisationStatus) {
    return this.clearingService.isAllowedToReject(state);
  }

  openSidebar(id: number, sideBarContentType: SidebarContentType) {
    this.orgFeedbackHistory = undefined;
    if (this.sidenav) {
      this.selectedOrgId = id;
      this.sidebarContentType = sideBarContentType;
      this.sidenav.open();
      if (sideBarContentType === 'duplicates') {
        this.clearingService.getDuplicate(id);
      }
    }
  }

  getFeedbackHistory(org: OrganisationWIP[]): Feedback[] {
    const organisation = org.find((o) => o.id === this.selectedOrgId);

    if (organisation) {
      return organisation.feedbackHistory || [];
    } else {
      return [];
    }
  }

  closeSidenav() {
    this.sidenav?.close();
    this.orgFeedbackHistory = undefined;
    this.selectedOrgId = undefined;
  }
}
