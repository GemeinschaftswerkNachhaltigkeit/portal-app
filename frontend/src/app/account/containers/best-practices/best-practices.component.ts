import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from 'src/app/marketplace/components/card.component';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import { BestPracticesWipDto } from 'src/app/marketplace/models/best-practices-wip-dto';
import { MarketplaceTypes } from 'src/app/marketplace/models/marketplace-type';
import { Status } from 'src/app/marketplace/models/status';
import { CharCountComponent } from 'src/app/shared/components/base/char-count.component';
import { OutlinedIconComponent } from 'src/app/shared/components/base/outlined-icon.component';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { CardListComponent } from 'src/app/shared/components/cards/card-list.component';
import { ListWithHeadingLayoutComponent } from 'src/app/shared/components/layout/list-with-heading-layout.component';
import { PageWithHeaderLayoutComponent } from 'src/app/shared/components/layout/page-with-header-layout.component';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import { BestPracticesService } from 'src/app/marketplace/best-practices.service';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';

@Component({
  selector: 'app-best-practices',
  standalone: true,
  imports: [
    CommonModule,
    PageWithHeaderLayoutComponent,
    MatButtonModule,
    CharCountComponent,
    TranslateModule,
    ListWithHeadingLayoutComponent,
    CardListComponent,
    CardComponent,
    LoadingIndicatorComponent,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    OutlinedIconComponent,
    SpinnerComponent
  ],
  templateUrl: './best-practices.component.html',
  styleUrls: ['./best-practices.component.scss']
})
export class BestPracticesComponent implements OnInit {
  private bestPracticeService = inject(BestPracticesService);

  bestPractices = this.bestPracticeService.bestPractices;
  bestPracticeWips = this.bestPracticeService.bestPracticeWips;
  bestPracticesPaging = this.bestPracticeService.bestPracticesPaging;
  bestPracticeWipsPaging = this.bestPracticeService.bestPracticeWipsPaging;
  loading = this.bestPracticeService.loading;
  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = defaultPaginatorOptions.pageSizeOptions;
  type = MarketplaceTypes;
  status = Status;

  constructor() {}

  open(id?: number): void {
    if (id) {
      window.open(
        environment.contextPath + `marketplace/search/${id}`,
        '_blank'
      );
    }
  }

  handleStatusChange(bestPractice: BestPracticesDto, status: Status) {
    this.bestPracticeService.setStatus(bestPractice, status);
  }

  handleNew() {
    this.bestPracticeService.newBestPractice();
  }

  handlePageChanged(event: PageEvent): void {
    this.bestPracticeService.changeBestPracticesPage(
      event.pageIndex,
      event.pageSize
    );
  }
  handleWipsPageChanged(event: PageEvent): void {
    this.bestPracticeService.changeBestPracticeWipsPage(
      event.pageIndex,
      event.pageSize
    );
  }

  handleEditBestPractice(offer: BestPracticesDto): void {
    this.bestPracticeService.editBestPractice(offer);
  }

  handleEditBestPracticeWip(offerWip: BestPracticesWipDto): void {
    this.bestPracticeService.editBestPracticeWip(offerWip);
  }

  handleDeleteBestPractice(offer: BestPracticesDto): void {
    this.bestPracticeService.deleteBestPractice(offer);
  }

  handleDeleteBestPracticeWip(offerWip: BestPracticesWipDto): void {
    this.bestPracticeService.deleteBestPracticeWip(offerWip);
  }

  ngOnInit(): void {
    this.bestPracticeService.getBestPractices();
    this.bestPracticeService.getBestPracticeWips();
  }
}
