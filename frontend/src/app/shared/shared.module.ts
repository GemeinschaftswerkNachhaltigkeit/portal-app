import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldErrorComponent } from './standalone/form/form-field-error/form-field-error.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertComponent } from './standalone/base/alert.component';
import { TiptapMenuBarComponent } from './components/tiptap-menu-bar/tiptap-menu-bar.component';
import { MenuItemDirective } from './standalone/layout/page-menu/menu-item.directive';
import { MenuItemActiveDirective } from './standalone/layout/page-menu/menu-item-active.directive';
import { RouterModule } from '@angular/router';
import { ActionComponent } from './standalone/base/action.component';
import { FeedbackComponent } from './components/feedback/feedback/feedback.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ThematicFocusControlComponent } from './components/form/thematic-focus-select/thematic-focus-control.component';
import { MatSelectModule } from '@angular/material/select';
import { CategoryControlComponent } from './components/form/category-control/category-control.component';
import { UserSelectControlComponent } from './components/form/user-select-control/user-select-control.component';
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
import { HtmlWrapperComponent } from './standalone/base/html-wrapper.component';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { RegisterOrLoginModalComponent } from './components/register-or-login-modal/register-or-login-modal.component';
import { HeadingComponent } from './standalone/base/heading.component';
import { ExpiredBadgeComponent } from './standalone/base/badges/expired-badge.component';
import { OutlinedIconComponent } from './standalone/base/outlined-icon.component';
import { LabelComponent } from './standalone/base/label.component';
import { CardLabelComponent } from './standalone/cards/card-label.component';
import { ContentRowComponent } from './standalone/base/content-row.component';
import { CardLogoComponent } from './standalone/cards/card-logo.component';
import { NewBadgeComponent } from './standalone/base/badges/new-badge.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ContentWrapperComponent } from './standalone/layout/content-wrapper.component';

@NgModule({
  declarations: [
    TiptapMenuBarComponent,
    MenuItemDirective,
    MenuItemActiveDirective,
    FeedbackComponent,
    ThematicFocusControlComponent,
    AddressControlsComponent,
    CategoryControlComponent,
    UserSelectControlComponent,
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
    FeatureComponent,
    FormStepActionsComponent,
    FormStepDescriptionComponent,
    UploadImageComponent,
    OnlineFilterComponent,
    OnlyDanFilterComponent,
    FormAdvantagesComponent,
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
    CardLogoComponent,
    NewBadgeComponent,
    HtmlWrapperComponent,
    ContentWrapperComponent,
    FormFieldErrorComponent
  ],
  exports: [
    CommonModule,
    TranslateModule,
    TiptapMenuBarComponent,
    MenuItemDirective,
    MenuItemActiveDirective,
    ThematicFocusControlComponent,
    CategoryControlComponent,
    UserSelectControlComponent,
    ValidCheckComponent,
    SearchInputComponent,
    AdditionalFiltersModalComponent,
    FilterCountBadgeComponent,
    CheckboxFilterComponent,
    FilterModalButtonComponent,
    SecondaryFiltersComponent,
    ContactControlsComponent,
    FeatureComponent,
    FormStepActionsComponent,
    FormStepDescriptionComponent,
    UploadImageComponent,
    AddressControlsComponent,
    FormAdvantagesComponent
  ]
})
export class SharedModule {}
