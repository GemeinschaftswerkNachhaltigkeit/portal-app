import { NgModule } from '@angular/core';
import { MapContainerComponent } from './containers/map-container/map-container.component';
import { SharedMapModule } from '../shared-map.module';
import { MapRoutingModule } from './map-routing.module';
import { MapLayoutComponent } from './components/map/map-layout/map-layout.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { DetailsCardComponent } from '../map/containers/details-card/details-card.component';
import { MapComponent } from './components/map/map.component';


import {
  LuxonDateAdapter,
  MatLuxonDateModule,
  MAT_LUXON_DATE_ADAPTER_OPTIONS
} from '@angular/material-luxon-adapter';
import {
  DateAdapter,
  MatDateFormats,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { PaginatorWrapperComponent } from './components/map/paginator-wrapper/paginator-wrapper.component';

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D'
  },
  display: {
    dateInput: 'dd.LL.yyyy',
    monthYearLabel: 'LLL yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'LLL yyyy'
  }
};

@NgModule({
  declarations: [
    MapComponent,
    MapContainerComponent,
    MapLayoutComponent,
    SearchFormComponent,
    PaginatorWrapperComponent,
    DetailsCardComponent
  ],
  imports: [
    SharedMapModule,
    MapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    NgxMatomoTrackerModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: LuxonDateAdapter },
    {
      provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
      useValue: { firstDayOfWeek: 1 }
    }
  ]
})
export class MapModule {}