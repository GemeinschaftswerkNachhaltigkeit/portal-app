import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = this.translate.instant('paging.first');
  itemsPerPageLabel = this.translate.instant('paging.itemsPerPage');
  lastPageLabel = this.translate.instant('paging.last');
  nextPageLabel = this.translate.instant('paging.next');
  previousPageLabel = this.translate.instant('paging.prev');

  constructor(private translate: TranslateService) {
    translate.onLangChange.subscribe(() => {
      this.firstPageLabel = this.translate.instant('paging.first');
      this.itemsPerPageLabel = this.translate.instant('paging.itemsPerPage');
      this.lastPageLabel = this.translate.instant('paging.last');
      this.nextPageLabel = this.translate.instant('paging.next');
      this.previousPageLabel = this.translate.instant('paging.prev');
      this.changes.next();
    });
  }

  getRangeLabel(page: number, pageSize: number, length: number): string {
    // if (length === 0) {
    //   return this.translate.instant(`Page 1 of 1`);
    // }
    const amountPages = Math.ceil(length / pageSize);
    // return this.translate.instant(`Page ${page + 1} of ${amountPages}`);
    return this.translate.instant('paging.of', {
      page: page + 1,
      amount: amountPages
    });
  }
}
