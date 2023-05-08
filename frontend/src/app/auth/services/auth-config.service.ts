import { InjectionToken } from '@angular/core';
import { AuthConfig, OAuthModuleConfig } from 'angular-oauth2-oidc';

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionTToken used to import the config object, provided from the outside
 */
export const AuthConfigService = new InjectionToken<AuthConfig>('AuthConfig');

export const OAuthModuleConfigService = new InjectionToken<OAuthModuleConfig>(
  'OAuthModuleConfig'
);
