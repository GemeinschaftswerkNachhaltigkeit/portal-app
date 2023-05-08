export let environment = {
  production: true,
  apiUrl: '/app/api/v1',
  contextPath: '/app/',
  directusBaseUrl: 'load-from-backend',
  landingPageUrl: 'load-from-backend',
  assetsUrl: '/app/assets',
  matomoUrl: 'https://matomo.nachhaltigkeitsrat.de',
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
  contextPath: string;
  directusBaseUrl: string;
  landingPageUrl: string;
  assetsUrl: string;
  matomoUrl: string;
  matomoSiteId: number;
  danId: number;
  keycloak: { issuer: string; clientId: string; debug: boolean };
}): void {
  environment = e;
}
