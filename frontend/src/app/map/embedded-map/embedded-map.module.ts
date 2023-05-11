import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EmbeddedMapRoutingModule } from './embedded-map-routing.module';
// import { MapLayoutComponent } from './components/map/map-layout/map-layout.component';
// import { SearchFormComponent } from './components/search-form/search-form.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
// import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
// import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
// import { MatIconModule } from '@angular/material/icon';
// import { MapComponent } from './components/map/map.component';
// import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
// import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
// import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
// import { DetailsCardComponent } from './containers/details-card/details-card.component';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';

// import {
//   LuxonDateAdapter,
//   MatLuxonDateModule,
//   MAT_LUXON_DATE_ADAPTER_OPTIONS
// } from '@angular/material-luxon-adapter';
// import {
//   DateAdapter,
//   MatDateFormats,
//   MAT_DATE_LOCALE
// } from '@angular/material/core';
// import { DetailsLinkComponent } from './components/map/details-link/details-link.component';
// import { PaginatorWrapperComponent } from './components/map/paginator-wrapper/paginator-wrapper.component';
import { EmbeddedMapContainerComponent } from './containers/embedded-map-container/embedded-map-container.component';
import { EmbeddedMapDetailsCardComponent } from './containers/embedded-map-details-card/embedded-map-details-card.component';
import { EmbeddedMapLayoutComponent } from './components/map/embedded-map-layout/embedded-map-layout.component';

// export const APP_DATE_FORMATS: MatDateFormats = {
//   parse: {
//     dateInput: 'D'
//   },
//   display: {
//     dateInput: 'dd.LL.yyyy',
//     monthYearLabel: 'LLL yyyy',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'LLL yyyy'
//   }
// };

@NgModule({
  declarations: [
    // MapContainerComponent,
    // MapLayoutComponent,
    // SearchFormComponent,
    // MapComponent,
    // DetailsCardComponent,
    // DetailsLinkComponent,
    // PaginatorWrapperComponent,
    EmbeddedMapContainerComponent,
    EmbeddedMapDetailsCardComponent,
    EmbeddedMapLayoutComponent
  ],
  imports: [
    SharedModule,
    EmbeddedMapRoutingModule,
    // FormsModule,
    // ReactiveFormsModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatSelectModule,
    // MatIconModule,
    // MatButtonModule,
    // MatPaginatorModule,
    // MatDialogModule,
    // MatExpansionModule,
    // MatCheckboxModule,
    // MatDatepickerModule,
    // MatLuxonDateModule,
    // NgxMatomoTrackerModule
  ],
  // providers: [
  //   { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
  //   { provide: DateAdapter, useClass: LuxonDateAdapter },
  //   {
  //     provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
  //     useValue: { firstDayOfWeek: 1 }
  //   }
  // ]
})
export class EmbeddedMapModule {}
