import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FooterComponent } from './layout/footer/footer.component';
import { MainHeaderComponent } from './layout/header/main-header.component';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarContentComponent } from './layout/sidebar-content/sidebar-content.component';
import { NavActionsComponent } from './layout/nav-actions/nav-actions.component';
import { LangToggleComponent } from './layout/lang-toggle/lang-toggle.component';
import { LogoComponent } from './layout/logo/logo.component';
import { SharedModule } from '../shared/shared.module';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { CustomPaginatorIntl } from './custom-paginator-intl.service';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RegisterOrLoginModalComponent } from './register-or-login-modal/register-or-login-modal.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { DropdownMenuComponent } from './main-menu/dropdown-menu/dropdown-menu.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MenuEntryComponent } from './main-menu/menu-entry/menu-entry.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AccordionMenuItemComponent } from './main-menu/accordion-menu-item/accordion-menu-item.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    FooterComponent,
    MainHeaderComponent,
    BaseLayoutComponent,
    SidebarContentComponent,
    NavActionsComponent,
    LangToggleComponent,
    LogoComponent,
    MainMenuComponent,
    RegisterOrLoginModalComponent,
    ConfirmationModalComponent,
    DropdownMenuComponent,
    MenuEntryComponent,
    AccordionMenuItemComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule,
    TranslateModule.forRoot({
      defaultLanguage: 'de',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    AuthModule,
    CdkMenuModule,
    CdkAccordionModule
  ],
  exports: [BaseLayoutComponent],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }]
})
export class CoreModule {}
