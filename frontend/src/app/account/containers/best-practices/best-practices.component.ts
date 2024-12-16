import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { BestPracticesFacadeService } from 'src/app/marketplace/best-practices-facade.service';
import { CardComponent } from 'src/app/marketplace/components/card.component';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import { BestPracticesWipDto } from 'src/app/marketplace/models/best-practices-wip-dto';
import { MarketplaceTypes } from 'src/app/marketplace/models/marketplace-type';
import { Status } from 'src/app/marketplace/models/status';
import { CharCountComponent } from 'src/app/shared/components/base/char-count.component';
import { OutlinedIconComponent } from 'src/app/shared/components/base/outlined-icon.component';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { CardListComponent } from 'src/app/shared/components/cards/card-list.component';
import { ListWithHeadingLayoutComponent } from 'src/app/shared/components/layout/list-with-heading-layout.component';
import { PageWithHeaderLayoutComponent } from 'src/app/shared/components/layout/page-with-header-layout.component';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { environment } from 'src/environments/environment';

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
    SpinnerComponent,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    OutlinedIconComponent
  ],
  templateUrl: './best-practices.component.html',
  styleUrls: ['./best-practices.component.scss']
})
export class BestPracticesComponent implements OnInit {
  bestPractices$ = this.bestPracticesFacade.bestPractices$;
  bestPracticeWips$ = this.bestPracticesFacade.bestPracticeWips$;
  bestPracticesPaging$ = this.bestPracticesFacade.bestPracticesPaging$;
  bestPracticeWipsPaging$ = this.bestPracticesFacade.bestPracticeWipsPaging$;
  loading$ = this.loader.isLoading$('load-all-bestPractices');
  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = defaultPaginatorOptions.pageSizeOptions;
  type = MarketplaceTypes;
  status = Status;

  constructor(
    private bestPracticesFacade: BestPracticesFacadeService,
    private loader: LoadingService
  ) {}

  open(id?: number): void {
    if (id) {
      window.open(
        environment.contextPath + `marketplace/search/${id}`,
        '_blank'
      );
    }
  }

  handleStatusChange(bestPractice: BestPracticesDto, status: Status) {
    this.bestPracticesFacade.setStatus(bestPractice, status);
  }

  handleNew() {
    this.bestPracticesFacade.newBestPractice();
  }

  handlePageChanged(event: PageEvent): void {
    this.bestPracticesFacade.changeBestPracticesPage(
      event.pageIndex,
      event.pageSize
    );
  }
  handleWipsPageChanged(event: PageEvent): void {
    this.bestPracticesFacade.changeBestPracticeWipsPage(
      event.pageIndex,
      event.pageSize
    );
  }

  handleEditBestPractice(offer: BestPracticesDto): void {
    this.bestPracticesFacade.editBestPractice(offer);
  }

  handleEditBestPracticeWip(offerWip: BestPracticesWipDto): void {
    this.bestPracticesFacade.editBestPracticeWip(offerWip);
  }

  handleDeleteBestPractice(offer: BestPracticesDto): void {
    this.bestPracticesFacade.deleteBestPractice(offer);
  }

  handleDeleteBestPracticeWip(offerWip: BestPracticesWipDto): void {
    this.bestPracticesFacade.deleteBestPracticeWip(offerWip);
  }

  ngOnInit(): void {
    this.bestPracticesFacade.loadBestPracticesAndBestPracticeWips();
  }
}
