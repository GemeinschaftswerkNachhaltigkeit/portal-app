import { Injectable } from '@angular/core';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  constructor(private translate: TranslateService) {}

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = this.translate.instant('paging.first');
  itemsPerPageLabel = this.translate.instant('paging.itemsPerPage');
  lastPageLabel = this.translate.instant('paging.last');

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = this.translate.instant('paging.next');
  previousPageLabel = this.translate.instant('paging.prev');

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
