import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ExampleComponent } from './example/example.component';
import { AuthModule } from './auth/auth.module';
import { authConfig, restrictedUrls } from './app-auth.config';
import { NgxMatomoTrackerModule } from 'ngx-matomo-client';
import { NgxMatomoRouterModule } from 'ngx-matomo-client';
import { environment } from 'src/environments/environment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
  MatNativeDateModule
} from '@angular/material/core';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import {
  LuxonDateAdapter,
  MAT_LUXON_DATE_ADAPTER_OPTIONS
} from '@angular/material-luxon-adapter';

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
  declarations: [AppComponent, ExampleComponent],
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    MatNativeDateModule,
    AuthModule.forRoot(authConfig, restrictedUrls),
    NgxMatomoTrackerModule.forRoot({
      trackerUrl: environment.matomoUrl,
      siteId: environment.matomoSiteId
    }),
    NgxMatomoRouterModule
  ],
  providers: [
    { provide: Window, useValue: window },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: DateAdapter, useClass: LuxonDateAdapter },
    {
      provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
      useValue: { firstDayOfWeek: 1 }
    },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeDe, 'de');
  }
}
