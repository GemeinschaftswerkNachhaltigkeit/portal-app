/*  eslint-disable  @typescript-eslint/no-explicit-any */

import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

export const getAuthConfig = (env: any): AuthConfig => {
  return {
    issuer: env.keycloak.issuer,
    redirectUri: window.location.origin + env.contextPath,
    clientId: env.keycloak.clientId,
    scope: 'openid profile email offline_access',
    responseType: 'code',
    openUri: (uri: string) => {
      /*
       * use 'forceRegistration' as query parameter on routes with forced login to redirect the user to kc-registration instead of kc-login
       */
      if (uri.includes('forceRegistration')) {
        uri = uri.replace('/auth?', '/registrations?');
      } else if (uri.includes('forceNewPassword')) {
        uri = uri + '&kc_action=UPDATE_PASSWORD';
      } else if (uri.includes('deleteAccount')) {
        uri = uri + '&kc_action=delete_account';
      }

      location.href = uri;
    }
  };
};

export const restrictedUrls: string[] = [environment.apiUrl];
