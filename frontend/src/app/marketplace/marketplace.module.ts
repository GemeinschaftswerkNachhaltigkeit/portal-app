import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersFormComponent } from './containers/offers-form/offers-form.component';
import { MarketplcaeRoutingModule } from './marketplace-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormSectionComponent } from './components/form-section/form-section.component';
import { FormSectionListComponent } from './components/form-section-list/form-section-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { NgxTiptapModule } from 'ngx-tiptap';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ContentControlsComponent } from './components/content-controls/content-controls.component';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { CardComponent } from './components/card/card.component';
import { BestPracticesFormComponent } from './containers/best-practices-form/best-practices-form.component';
import { MarketplaceSearchComponent } from './containers/marketplace-search/marketplace-search.component';
import { MarketplaceLayoutComponent } from './components/marketplace-layout/marketplace-layout.component';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MarketplaceItemDetailsComponent } from './containers/marketplace-item-details/marketplace-item-details.component';
import { MarketplaceItemDetailsLayoutComponent } from './components/marketplace-item-details-layout/marketplace-item-details-layout.component';
import { HeroComponent } from './components/hero/hero.component';
import { ContactComponent } from './components/contact/contact.component';
import { SwiperModule } from 'swiper/angular';
import { PartnerLinksComponent } from './components/partner-links/partner-links.component';
import { AddBannerComponent } from './components/add-banner/add-banner.component';
import { AuthModule } from '../auth/auth.module';
import { VisibilityControlsComponent } from './components/visibility-controls/visibility-controls.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

@NgModule({
  declarations: [
    OffersFormComponent,
    FormSectionComponent,
    FormSectionListComponent,
    ImageUploadComponent,
    ContentControlsComponent,
    CardComponent,
    BestPracticesFormComponent,
    MarketplaceSearchComponent,
    MarketplaceLayoutComponent,
    MarketplaceItemDetailsComponent,
    MarketplaceItemDetailsLayoutComponent,
    HeroComponent,
    ContactComponent,
    PartnerLinksComponent,
    AddBannerComponent,
    VisibilityControlsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthModule,
    MarketplcaeRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    NgxTiptapModule,
    DropzoneModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCheckboxModule,
    SwiperModule,
    MatIconModule
  ],
  exports: [CardComponent]
})
export class MarketplaceModule {}
