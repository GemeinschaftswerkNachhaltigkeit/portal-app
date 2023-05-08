import { environment } from '../environments/environment';

export const authConfig = Object.defineProperties(
  {
    // Url des Authorization-Servers
    issuer: environment.keycloak.issuer,

    // Url der Angular-Anwendung
    // An diese URL sendet der Authorization-Server den Access Code
    redirectUri: window.location.origin + environment.contextPath,
    // Name der Angular-Anwendung
    clientId: environment.keycloak.clientId,
    timeoutFactor: 0.95,
    // URL of the SPA to redirect the user after silent refresh
    //https://github.com/manfredsteyer/angular-oauth2-oidc/blob/master/docs-src/silent-refresh.md
    silentRefreshRedirectUri:
      window.location.origin + '/assets/auth/silent-refresh.html',

    // Rechte des Benutzers, die die Angular-Anwendung wahrnehmen möchte
    scope: 'openid profile email',

    // Code Flow (PKCE ist standardmäßig bei Nutzung von Code Flow aktiviert)
    responseType: 'code',

    strictDiscoveryDocumentValidation: true,
    clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
    oidc: true,
    showDebugInformation: environment.keycloak.debug,
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
  },
  // nonceStateSeparator : 'semicolon' // Real semicolon gets mangled by IdentityServer's URI encoding
  {
    issuer: { get: () => environment.keycloak.issuer },
    redirectUri: {
      get: () => window.location.origin + environment.contextPath
    },
    clientId: { get: () => environment.keycloak.clientId },
    showDebugInformation: { get: () => environment.keycloak.debug },
    silentRefreshRedirectUri: {
      get: () =>
        window.location.origin +
        environment.contextPath +
        'assets/auth/silent-refresh.html'
    }
  }
);

export const restrictedUrls: string[] = [environment.apiUrl];
