export let environment = {
  production: true,
  apiUrl: '/app/api/v1',
  apiV2Url: '/app/api/v2',
  contextPath: '/app/',
  directusBaseUrl: 'load-from-backend',
  landingPageUrl: 'load-from-backend',
  assetsUrl: '/app/assets',
  matomoUrl: 'https://matomo.nachhaltigkeitsrat.de',
  matomoTagManagerContainerId: 'jFGzL2wu',
  matomoSiteId: 10,
  danId: 0,
  keycloak: {
    issuer: 'load-from-backend',
    clientId: 'load-from-backend',
    debug: false
  }
};

export function overrideEnvironment(e: {
  production: boolean;
  apiUrl: string;
  apiV2Url: string;
  contextPath: string;
  directusBaseUrl: string;
  landingPageUrl: string;
  assetsUrl: string;
  matomoUrl: string;
  matomoSiteId: number;
  danId: number;
  matomoTagManagerContainerId: string;
  keycloak: { issuer: string; clientId: string; debug: boolean };
}): void {
  environment = e;
}
