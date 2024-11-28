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
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertComponent } from './standalone/base/alert.component';
import { TiptapMenuBarComponent } from './components/tiptap-menu-bar/tiptap-menu-bar.component';
import { PageMenuComponent } from './components/layout/page-menu/page-menu.component';
import { MenuItemDirective } from './components/layout/page-menu/menu-item.directive';
import { MenuItemActiveDirective } from './components/layout/page-menu/menu-item-active.directive';
import { RouterModule } from '@angular/router';
import { SocialMediaLinksComponent } from './components/social-media-links/social-media-links.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { TopicComponent } from './components/topic/topic.component';
import { ActionComponent } from './standalone/base/action.component';
import { NotificationPageComponent } from './components/layout/notification-page/notification-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { FeedbackComponent } from './components/feedback/feedback/feedback.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from './components/layout/header/header.component';
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
import { ContactControlsComponent } from './components/form/contact-controls/contact-controls.component';
import { SpecialOrgasFilterComponent } from './components/form/filters/special-orgas-filter/special-orgas-filter.component';
import { NewBadgeComponent } from './components/new-badge/new-badge.component';
import { HtmlWrapperComponent } from './components/html-wrapper/html-wrapper.component';
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
import { OnlyDanFilterComponent } from './components/form/filters/only-dan-filter/only-dan-filter.component';
import { FormAdvantagesComponent } from './components/wizard/form-advatages/form-advatages.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { BaseLayoutComponent } from './components/layout/base-layout/base-layout.component';
import { MainHeaderComponent } from './components/layout/main-header/main-header.component';
import { SidebarContentComponent } from './components/layout/sidebar-content/sidebar-content.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FooterComponent } from './components/layout/footer/footer.component';
import { LangToggleComponent } from './components/layout/lang-toggle/lang-toggle.component';
import { NavActionsComponent } from './components/layout/nav-actions/nav-actions.component';
import { LogoComponent } from './components/layout/logo/logo.component';
import { MainMenuComponent } from './components/layout/main-menu/main-menu.component';
import { AccordionMenuItemComponent } from './components/layout/main-menu/accordion-menu-item/accordion-menu-item.component';
import { DropdownMenuComponent } from './components/layout/main-menu/dropdown-menu/dropdown-menu.component';
import { MenuEntryComponent } from './components/layout/main-menu/menu-entry/menu-entry.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RegisterOrLoginModalComponent } from './components/register-or-login-modal/register-or-login-modal.component';
import { HeadingComponent } from './standalone/base/heading.component';
import { ExpiredBadgeComponent } from './standalone/base/badges/expired-badge.component';
import { OutlinedIconComponent } from './standalone/base/outlined-icon.component';
import { LabelComponent } from './standalone/base/label.component';
import { CardLabelComponent } from './standalone/cards/card-label.component';
import { ContentRowComponent } from './standalone/base/content-row.component';
import { CardLogoComponent } from './standalone/cards/card-logo.component';

@NgModule({
  declarations: [
    SdgsListComponent,
    FormFieldErrorComponent,
    ContentWrapperComponent,
    SdgIconComponent,
    ToggleButtonComponent,
    SpinnerComponent,
    MessageInputDialogComponent,
    TiptapMenuBarComponent,
    PageMenuComponent,
    MenuItemDirective,
    MenuItemActiveDirective,
    SocialMediaLinksComponent,
    ErrorPageComponent,
    TopicComponent,
    NotificationPageComponent,
    NotFoundPageComponent,
    FeedbackComponent,
    HeaderComponent,
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
    FormAdvantagesComponent,
    ConfirmationModalComponent,
    BaseLayoutComponent,
    MainHeaderComponent,
    SidebarContentComponent,
    FooterComponent,
    LangToggleComponent,
    NavActionsComponent,
    LogoComponent,
    MainMenuComponent,
    DropdownMenuComponent,
    MenuEntryComponent,
    AccordionMenuItemComponent,
    RegisterOrLoginModalComponent
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
    MatButtonToggleModule,
    MatSidenavModule,
    CdkMenuModule,
    HeadingComponent,
    ExpiredBadgeComponent,
    OutlinedIconComponent,
    ActionComponent,
    AlertComponent,
    LabelComponent,
    CardLabelComponent,
    ContentRowComponent,
    CardLogoComponent
  ],
  exports: [
    CommonModule,
    TranslateModule,
    SdgsListComponent,
    SdgIconComponent,
    FormFieldErrorComponent,
    ContentWrapperComponent,
    ToggleButtonComponent,
    SpinnerComponent,
    MessageInputDialogComponent,
    TiptapMenuBarComponent,
    PageMenuComponent,
    MenuItemDirective,
    MenuItemActiveDirective,
    SocialMediaLinksComponent,
    TopicComponent,
    NotificationPageComponent,
    NotFoundPageComponent,
    HeaderComponent,
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
    ContactControlsComponent,
    NewBadgeComponent,
    HtmlWrapperComponent,
    FeatureComponent,
    FormStepActionsComponent,
    FormStepDescriptionComponent,
    UploadImageComponent,
    AddressControlsComponent,
    FormAdvantagesComponent,
    ConfirmationModalComponent,
    BaseLayoutComponent
  ]
})
export class SharedModule {}
