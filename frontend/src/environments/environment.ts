// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export let environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api/v1',
  contextPath: '/',
  directusBaseUrl: 'from_backend',
  landingPageUrl: 'http://localhost:3000',
  assetsUrl: '/assets',
  matomoUrl: 'http://localhost',
  matomoSiteId: 1,
  matomoTagManagerUrl: 'http://localhost/js/container_OpLDkCNf.js',
  danId: 0,
  keycloak: {
    issuer: 'https://wpgwn-auth.exxeta.info/realms/wpgwn',
    clientId: 'wpgwn',
    debug: false
  }
};

export function overrideEnvironment(e: {
  production: boolean;
  apiUrl: string;
  contextPath: string;
  directusBaseUrl: string;
  landingPageUrl: string;
  assetsUrl: string;
  matomoUrl: string;
  matomoSiteId: number;
  matomoTagManagerUrl: string;
  keycloak: { issuer: string; clientId: string; debug: boolean };
  danId: number;
}): void {
  environment = e;
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
