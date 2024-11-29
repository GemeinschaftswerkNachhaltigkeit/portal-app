import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersFormComponent } from './containers/offers-form/offers-form.component';
import { MarketplcaeRoutingModule } from './marketplace-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormSectionComponent } from './components/form-section/form-section.component';
import { FormSectionListComponent } from './components/form-section-list/form-section-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxTiptapModule } from 'ngx-tiptap';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentControlsComponent } from './components/content-controls/content-controls.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CardComponent } from './components/card/card.component';
import { BestPracticesFormComponent } from './containers/best-practices-form/best-practices-form.component';
import { MarketplaceSearchComponent } from './containers/marketplace-search/marketplace-search.component';
import { MarketplaceLayoutComponent } from './components/marketplace-layout/marketplace-layout.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MarketplaceItemDetailsComponent } from './containers/marketplace-item-details/marketplace-item-details.component';
import { MarketplaceItemDetailsLayoutComponent } from './components/marketplace-item-details-layout/marketplace-item-details-layout.component';
import { HeroComponent } from './components/hero/hero.component';
import { ContactComponent } from './components/contact/contact.component';
import { PartnerLinksComponent } from './components/partner-links/partner-links.component';
import { AddBannerComponent } from './components/add-banner/add-banner.component';
import { AuthModule } from '../auth/auth.module';
import { VisibilityControlsComponent } from './components/visibility-controls/visibility-controls.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { EventBadgesComponent } from '../shared/standalone/base/badges/event-badges.component copy';
import { CardListComponent } from '../shared/standalone/cards/card-list.component';
import { CategoryComponent } from '../shared/standalone/base/category.component';
import { LabelComponent } from '../shared/standalone/base/label.component';
import { ExpiredBadgeComponent } from '../shared/standalone/base/badges/expired-badge.component';
import { ActionComponent } from '../shared/standalone/base/action.component';
import { ContentRowComponent } from '../shared/standalone/base/content-row.component';
import { OutlinedIconComponent } from '../shared/standalone/base/outlined-icon.component';
import { ContentWrapperComponent } from '../shared/standalone/layout/content-wrapper.component';
import { HeadingComponent } from '../shared/standalone/base/heading.component';
import { HtmlWrapperComponent } from '../shared/standalone/base/html-wrapper.component';
import {
  BreadcrumbComponent,
  BreadcrumbsComponent
} from '../shared/standalone/base/breadcrumb';
import { SearchInputComponent } from '../shared/standalone/form/search-input.component';
import { CategoryControlComponent } from '../shared/standalone/form/category-control.component';
import { ThematicFocusControlComponent } from '../shared/standalone/form/thematic-focus-control.component';
import { PageWithHeaderLayoutComponent } from '../shared/standalone/layout/page-with-header-layout.component';
import { FormFieldErrorComponent } from '../shared/standalone/form/form-field-error/form-field-error.component';
import { AddressControlsComponent } from '../shared/standalone/form/address-control/address-controls.component';
import { ContactControlsComponent } from '../shared/standalone/form/contact-controls/contact-controls.component';
import { UploadImageComponent } from '../shared/standalone/form/upload-image/upload-image.component';

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
    MatDatepickerModule,
    MatLuxonDateModule,
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
    MatIconModule,
    EventBadgesComponent,
    CardListComponent,
    CategoryComponent,
    LabelComponent,
    ExpiredBadgeComponent,
    ActionComponent,
    ContentRowComponent,
    EventBadgesComponent,
    OutlinedIconComponent,
    ContentWrapperComponent,
    HeadingComponent,
    HtmlWrapperComponent,
    BreadcrumbComponent,
    BreadcrumbsComponent,
    SearchInputComponent,
    CategoryControlComponent,
    ThematicFocusControlComponent,
    PageWithHeaderLayoutComponent,
    FormFieldErrorComponent,
    AddressControlsComponent,
    ContactControlsComponent,
    UploadImageComponent
  ],
  exports: [CardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MarketplaceModule {}
