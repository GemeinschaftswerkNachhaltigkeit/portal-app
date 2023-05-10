import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthConfig,
  OAuthModule,
  OAuthModuleConfig,
  OAuthStorage
} from 'angular-oauth2-oidc';
import {
  AuthConfigService,
  OAuthModuleConfigService
} from './services/auth-config.service';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuardWithForcedLogin } from './guard/auth-guard-with-forced-login.service';
import { AuthGuardWithRoleCheck } from './guard/auth-guard-with-role-check.service';
import { AuthenticatedDirective } from './directives/authenticated.directive';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { AuthGuardWithLoginCheck } from './guard/auth-guard-login-check.service';
import { EmailVerifySuccessPageComponent } from './email-verify-success-page/email-verify-success-page.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthenticatedExcludingRolesDirective } from './directives/authenticated-excluding-roles.directive';
import { WithOrgaDirective } from './directives/with-orga.directive';
import { WithoutOrgaDirective } from './directives/without-orga.directive';

// We need a factory, since localStorage is not available during AOT build time.
// We use Local storage, because we need the registration across browser tabs.
// It is required, so that the user can open the e-mail link in a new tab/browser and can continue in on the same page
export function storageFactory(): OAuthStorage {
  return localStorage;
}

@NgModule({
  declarations: [
    AuthenticatedDirective,
    AuthenticatedExcludingRolesDirective,
    WithOrgaDirective,
    WithoutOrgaDirective,
    EmailVerifySuccessPageComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    SharedModule,
    OAuthModule.forRoot(), // OAuthModuleConfig is provided via OAuthModuleConfigService
    TranslateModule.forChild({
      extend: true
    }),
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  exports: [
    AuthenticatedDirective,
    AuthenticatedExcludingRolesDirective,
    WithOrgaDirective,
    WithoutOrgaDirective
  ],
  providers: [
    { provide: OAuthModuleConfig, useExisting: OAuthModuleConfigService },
    { provide: OAuthStorage, useFactory: storageFactory }
  ]
})
export class AuthModule {
  static forRoot(
    config: AuthConfig,
    allowedUrls: string[]
  ): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService,
        AuthGuardWithForcedLogin,
        AuthGuardWithLoginCheck,
        AuthGuardWithRoleCheck,
        {
          provide: AuthConfigService,
          useValue: config
        },
        {
          provide: OAuthModuleConfigService,
          useValue: {
            resourceServer: {
              sendAccessToken: true,
              allowedUrls
            }
          }
        }
      ]
    };
  }
}
