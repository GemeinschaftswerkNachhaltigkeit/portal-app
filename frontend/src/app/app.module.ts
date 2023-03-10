import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ExampleComponent } from './example/example.component';
import { AuthModule } from './auth/auth.module';
import { authConfig, restrictedUrls } from './app-auth.config';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { NgxMatomoRouterModule } from '@ngx-matomo/router';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [AppComponent, ExampleComponent],
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot(authConfig, restrictedUrls),
    NgxMatomoTrackerModule.forRoot({
      trackerUrl: environment.matomoUrl,
      siteId: environment.matomoSiteId
    }),
    NgxMatomoRouterModule
  ],
  providers: [{ provide: Window, useValue: window }],
  bootstrap: [AppComponent]
})
export class AppModule {}
