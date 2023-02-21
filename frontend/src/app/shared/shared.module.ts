import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdgsListComponent } from './sdgs-list/sdgs-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldErrorComponent } from './form-field-error/form-field-error.component';
import { ContentWrapperComponent } from './layout/content-wrapper/content-wrapper.component';
import { SdgIconComponent } from './sdg-icon/sdg-icon.component';
import { OutlinedIconComponent } from './outlined-icon/outlined-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { MatButtonModule } from '@angular/material/button';
import { LabelComponent } from './label/label.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContentRowComponent } from './content-row/content-row.component';
import { AlertComponent } from './alert/alert.component';
import { TiptapMenuBarComponent } from './tiptap-menu-bar/tiptap-menu-bar.component';
import { PageMenuComponent } from './layout/page-menu/page-menu.component';
import { MenuItemDirective } from './layout/page-menu/menu-item.directive';
import { MenuItemActiveDirective } from './layout/page-menu/menu-item-active.directive';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { CardLogoComponent } from './card-logo/card-logo.component';
import { CardLabelComponent } from './card-label/card-label.component';
import { SocialMediaLinksComponent } from './social-media-links/social-media-links.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { TopicComponent } from './topic/topic.component';
import { ActionComponent } from './action/action.component';
import { NotificationPageComponent } from './layout/notification-page/notification-page.component';
import { BaseCardComponent } from './base-card/base-card.component';
import { OrganisationSubscriptionActionComponent } from './subscription/containers/organisation-subscription-action/organisation-subscription-action.component';
import { ActivitySubscriptionActionComponent } from './subscription/containers/activity-subscription-action/activity-subscription-action.component';
import { HeadingComponent } from './heading/heading.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { FeedbackComponent } from './feedback/feedback/feedback.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CardListComponent } from './card-list/card-list.component';
import { HeaderComponent } from './layout/header/header.component';
import { ExpiredBadgeComponent } from './expired-badge/expired-badge.component';
import { CharCountComponent } from './char-count/char-count.component';
import { PageWithHeaderLayoutComponent } from './layout/page-with-header-layout/page-with-header-layout.component';
import { MessageInputDialogComponent } from './message-input-dialog/message-input-dialog.component';
import { ListWithHeadingLayoutComponent } from './layout/list-with-heading-layout/list-with-heading-layout.component';
import { InfoCardComponent } from './info-card/info-card.component';
import { ThematicFocusControlComponent } from './form/thematic-focus-select/thematic-focus-control.component';
import { MatSelectModule } from '@angular/material/select';
import { CategoryControlComponent } from './form/category-control/category-control.component';
import { UserSelectControlComponent } from './form/user-select-control/user-select-control.component';
import { TextBlockComponent } from './text-block/text-block.component';
import { ValidCheckComponent } from './form/valid-check/valid-check.component';
import { SearchInputComponent } from './form/search-input/search-input.component';
import { AdditionalFiltersModalComponent } from './form/filters/additional-filters-modal/additional-filters-modal.component';
import { FilterCountBadgeComponent } from './form/filters/filter-count-badge/filter-count-badge.component';
import { CheckboxFilterComponent } from './form/filters/checkbox-filter/checkbox-filter.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { ThematicFocusFilterComponent } from './form/filters/thematic-focus-filter/thematic-focus-filter.component';
import { CollapsibleFilterComponent } from './form/filters/collapsible-filter/collapsible-filter.component';
import { SdgFilterComponent } from './form/filters/sdg-filter/sdg-filter.component';
import { ImpactAreasFilterComponent } from './form/filters/impact-areas-filter/impact-areas-filter.component';
import { OrgaTypesFilterComponent } from './form/filters/orga-types-filter/orga-types-filter.component';
import { ActiTypesFilterComponent } from './form/filters/acti-types-filter/acti-types-filter.component';
import { ActivityPeriodFilterComponent } from './form/filters/activity-period-filter/activity-period-filter.component';
import { SecondaryFiltersComponent } from './form/filters/secondary-filters/secondary-filters.component';
import { OfferCategoryFilterComponent } from './form/filters/offer-category-filter/offer-category-filter.component';
import { BestPracticeCategoryFilterComponent } from './form/filters/best-practice-category-filter/best-practice-category-filter.component';
import { FilterModalButtonComponent } from './form/filters/filter-modal-button/filter-modal-button.component';
import { OrderedFilterComponent } from './form/filters/ordered-filter/ordered-filter.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { InitiatorBadgeComponent } from './initiator-badge/initiator-badge.component';
import { CategoryComponent } from './category/category.component';
import { OfferSubscriptionActionComponent } from './subscription/containers/offer-subscription-action/offer-subscription-action.component';
import { BestPracticeSubscriptionActionComponent } from './subscription/containers/best-practice-subscription-action/best-practice-subscription-action.component';
import { ContactControlsComponent } from './form/contact-controls/contact-controls.component';

@NgModule({
  declarations: [
    SdgsListComponent,
    FormFieldErrorComponent,
    ContentWrapperComponent,
    OutlinedIconComponent,
    SdgIconComponent,
    ToggleButtonComponent,
    LabelComponent,
    SpinnerComponent,
    MessageInputDialogComponent,
    ContentRowComponent,
    AlertComponent,
    TiptapMenuBarComponent,
    PageMenuComponent,
    MenuItemDirective,
    MenuItemActiveDirective,
    BreadcrumbsComponent,
    CardLogoComponent,
    CardLabelComponent,
    SocialMediaLinksComponent,
    ErrorPageComponent,
    TopicComponent,
    ActionComponent,
    NotificationPageComponent,
    BaseCardComponent,
    OrganisationSubscriptionActionComponent,
    ActivitySubscriptionActionComponent,
    OfferSubscriptionActionComponent,
    BestPracticeSubscriptionActionComponent,
    HeadingComponent,
    NotFoundPageComponent,
    FeedbackComponent,
    CardListComponent,
    HeaderComponent,
    ExpiredBadgeComponent,
    CharCountComponent,
    PageWithHeaderLayoutComponent,
    ListWithHeadingLayoutComponent,
    InfoCardComponent,
    ThematicFocusControlComponent,
    CategoryControlComponent,
    UserSelectControlComponent,
    TextBlockComponent,
    ValidCheckComponent,
    SearchInputComponent,
    AdditionalFiltersModalComponent,
    FilterCountBadgeComponent,
    CheckboxFilterComponent,
    ThematicFocusFilterComponent,
    CollapsibleFilterComponent,
    SdgFilterComponent,
    ImpactAreasFilterComponent,
    OrgaTypesFilterComponent,
    ActiTypesFilterComponent,
    ActivityPeriodFilterComponent,
    SecondaryFiltersComponent,
    OfferCategoryFilterComponent,
    BestPracticeCategoryFilterComponent,
    FilterModalButtonComponent,
    OrderedFilterComponent,
    BreadcrumbComponent,
    InitiatorBadgeComponent,
    CategoryComponent,
    ContactControlsComponent
  ],
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
    FormsModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    SdgsListComponent,
    SdgIconComponent,
    OutlinedIconComponent,
    FormFieldErrorComponent,
    ContentWrapperComponent,
    ToggleButtonComponent,
    LabelComponent,
    SpinnerComponent,
    MessageInputDialogComponent,
    ContentRowComponent,
    TiptapMenuBarComponent,
    AlertComponent,
    PageMenuComponent,
    MenuItemDirective,
    MenuItemActiveDirective,
    BreadcrumbComponent,
    BreadcrumbsComponent,
    CardLogoComponent,
    CardLabelComponent,
    SocialMediaLinksComponent,
    TopicComponent,
    ActionComponent,
    NotificationPageComponent,
    BaseCardComponent,
    ActivitySubscriptionActionComponent,
    OrganisationSubscriptionActionComponent,
    OfferSubscriptionActionComponent,
    BestPracticeSubscriptionActionComponent,
    HeadingComponent,
    NotFoundPageComponent,
    CardListComponent,
    HeaderComponent,
    ExpiredBadgeComponent,
    CharCountComponent,
    PageWithHeaderLayoutComponent,
    ListWithHeadingLayoutComponent,
    InfoCardComponent,
    ThematicFocusControlComponent,
    CategoryControlComponent,
    UserSelectControlComponent,
    TextBlockComponent,
    ValidCheckComponent,
    SearchInputComponent,
    AdditionalFiltersModalComponent,
    FilterCountBadgeComponent,
    CheckboxFilterComponent,
    FilterModalButtonComponent,
    SecondaryFiltersComponent,
    InitiatorBadgeComponent,
    CategoryComponent,
    ContactControlsComponent
  ]
})
export class SharedModule {}
