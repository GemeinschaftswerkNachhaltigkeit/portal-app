import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdgsListComponent } from './components/sdgs-list/sdgs-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { ContentWrapperComponent } from './components/layout/content-wrapper/content-wrapper.component';
import { SdgIconComponent } from './components/sdg-icon/sdg-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { MatButtonModule } from '@angular/material/button';
import { LabelComponent } from './components/label/label.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContentRowComponent } from './components/content-row/content-row.component';
import { AlertComponent } from './components/alert/alert.component';
import { TiptapMenuBarComponent } from './components/tiptap-menu-bar/tiptap-menu-bar.component';
import { PageMenuComponent } from './components/layout/page-menu/page-menu.component';
import { MenuItemDirective } from './components/layout/page-menu/menu-item.directive';
import { MenuItemActiveDirective } from './components/layout/page-menu/menu-item-active.directive';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { CardLogoComponent } from './components/card-logo/card-logo.component';
import { CardLabelComponent } from './components/card-label/card-label.component';
import { SocialMediaLinksComponent } from './components/social-media-links/social-media-links.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { TopicComponent } from './components/topic/topic.component';
import { ActionComponent } from './components/action/action.component';
import { NotificationPageComponent } from './components/layout/notification-page/notification-page.component';
import { BaseCardComponent } from './components/base-card/base-card.component';
import { OrganisationSubscriptionActionComponent } from './components/subscription/containers/organisation-subscription-action/organisation-subscription-action.component';
import { ActivitySubscriptionActionComponent } from './components/subscription/containers/activity-subscription-action/activity-subscription-action.component';
import { HeadingComponent } from './components/heading/heading.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { FeedbackComponent } from './components/feedback/feedback/feedback.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CardListComponent } from './components/card-list/card-list.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { ExpiredBadgeComponent } from './components/expired-badge/expired-badge.component';
import { CharCountComponent } from './components/char-count/char-count.component';
import { PageWithHeaderLayoutComponent } from './components/layout/page-with-header-layout/page-with-header-layout.component';
import { MessageInputDialogComponent } from './components/message-input-dialog/message-input-dialog.component';
import { ListWithHeadingLayoutComponent } from './components/layout/list-with-heading-layout/list-with-heading-layout.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { ThematicFocusControlComponent } from './components/form/thematic-focus-select/thematic-focus-control.component';
import { MatSelectModule } from '@angular/material/select';
import { CategoryControlComponent } from './components/form/category-control/category-control.component';
import { UserSelectControlComponent } from './components/form/user-select-control/user-select-control.component';
import { TextBlockComponent } from './components/text-block/text-block.component';
import { ValidCheckComponent } from './components/form/valid-check/valid-check.component';
import { SearchInputComponent } from './components/form/search-input/search-input.component';
import { AdditionalFiltersModalComponent } from './components/form/filters/additional-filters-modal/additional-filters-modal.component';
import { FilterCountBadgeComponent } from './components/form/filters/filter-count-badge/filter-count-badge.component';
import { CheckboxFilterComponent } from './components/form/filters/checkbox-filter/checkbox-filter.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { ThematicFocusFilterComponent } from './components/form/filters/thematic-focus-filter/thematic-focus-filter.component';
import { CollapsibleFilterComponent } from './components/form/filters/collapsible-filter/collapsible-filter.component';
import { SdgFilterComponent } from './components/form/filters/sdg-filter/sdg-filter.component';
import { ImpactAreasFilterComponent } from './components/form/filters/impact-areas-filter/impact-areas-filter.component';
import { OrgaTypesFilterComponent } from './components/form/filters/orga-types-filter/orga-types-filter.component';
import { ActiTypesFilterComponent } from './components/form/filters/acti-types-filter/acti-types-filter.component';
import { ActivityPeriodFilterComponent } from './components/form/filters/activity-period-filter/activity-period-filter.component';
import { SecondaryFiltersComponent } from './components/form/filters/secondary-filters/secondary-filters.component';
import { OfferCategoryFilterComponent } from './components/form/filters/offer-category-filter/offer-category-filter.component';
import { BestPracticeCategoryFilterComponent } from './components/form/filters/best-practice-category-filter/best-practice-category-filter.component';
import { FilterModalButtonComponent } from './components/form/filters/filter-modal-button/filter-modal-button.component';
import { OrderedFilterComponent } from './components/form/filters/ordered-filter/ordered-filter.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CategoryComponent } from './components/category/category.component';
import { OfferSubscriptionActionComponent } from './components/subscription/containers/offer-subscription-action/offer-subscription-action.component';
import { BestPracticeSubscriptionActionComponent } from './components/subscription/containers/best-practice-subscription-action/best-practice-subscription-action.component';
import { ContactControlsComponent } from './components/form/contact-controls/contact-controls.component';
import { SpecialOrgasFilterComponent } from './components/form/filters/special-orgas-filter/special-orgas-filter.component';
import { NewBadgeComponent } from './components/new-badge/new-badge.component';
import { HtmlWrapperComponent } from './components/html-wrapper/html-wrapper.component';
import { OutlinedIconComponent } from './components/outlined-icon/outlined-icon.component';
import { FeatureComponent } from './components/feature/feature.component';
import { FormStepActionsComponent } from './components/wizard/form-step-actions/form-step-actions.component';
import { FormStepDescriptionComponent } from './components/wizard/form-step-description/form-step-description.component';
import { MatStepperModule } from '@angular/material/stepper';
import { UploadImageComponent } from './components/form/upload-image/upload-image.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { AddressControlsComponent } from './components/form/address-control/address-controls.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OnlineFilterComponent } from './components/form/filters/online-filter/online-filter.component';
import { ImageComponent } from './components/image/image.component';
import { OnlyDanFilterComponent } from './components/form/filters/only-dan-filter/only-dan-filter.component';
import { FormAdvantagesComponent } from './components/wizard/form-advatages/form-advatages.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
    AddressControlsComponent,
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
    CategoryComponent,
    ContactControlsComponent,
    SpecialOrgasFilterComponent,
    NewBadgeComponent,
    HtmlWrapperComponent,
    FeatureComponent,
    FormStepActionsComponent,
    FormStepDescriptionComponent,
    UploadImageComponent,
    OnlineFilterComponent,
    OnlyDanFilterComponent,
    ImageComponent,
    FormAdvantagesComponent
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
    FormsModule,
    MatStepperModule,
    MatTooltipModule,
    DropzoneModule,
    MatSlideToggleModule,
    MatButtonToggleModule
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
    CategoryComponent,
    ContactControlsComponent,
    NewBadgeComponent,
    HtmlWrapperComponent,
    FeatureComponent,
    FormStepActionsComponent,
    FormStepDescriptionComponent,
    UploadImageComponent,
    AddressControlsComponent,
    ImageComponent,
    FormAdvantagesComponent
  ]
})
export class SharedModule {}
