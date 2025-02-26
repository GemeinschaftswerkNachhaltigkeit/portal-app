/*  eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import {
  UserPermission,
  UserPermissionRoleMap,
  UserRole
} from '../models/user-role';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { getAuthConfig } from 'src/app/app-auth.config';
import { environment } from 'src/environments/environment';
import { EmailVerifySuccessService } from './email-verify-success.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  oauthService = inject(OAuthService);
  router = inject(Router);
  emailVerifyService = inject(EmailVerifySuccessService);

  constructor() {
    this.oauthService.configure(getAuthConfig(environment));
    this.oauthService.setStorage(localStorage);

    this.oauthService.events
      .pipe(
        filter((e) => ['session_terminated', 'session_error'].includes(e.type))
      )
      .subscribe(() => this.navigateToLoginPage());

    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe(() => this.oauthService.loadUserProfile());

    window.addEventListener('storage', (event) => {
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
      );

      if (!this.oauthService.hasValidAccessToken()) {
        this.navigateToLoginPage();
      }
    });

    this.oauthService.setupAutomaticSilentRefresh();
  }

  public isAuthenticated() {
    return this.oauthService.hasValidAccessToken();
  }

  private navigateToLoginPage(): void {
    this.router
      .navigateByUrl('/')
      .catch((error) => console.error('Error navigating to "/".', error));
  }

  public async init(): Promise<void> {
    await this.oauthService.loadDiscoveryDocumentAndTryLogin({});

    if (!this.oauthService.hasValidAccessToken()) {
      await this.oauthService.revokeTokenAndLogout();
    }

    const state = this.oauthService.state;

    if (state && state !== 'undefined' && state !== 'null') {
      let stateUrl = state;
      if (!stateUrl.startsWith('/')) {
        stateUrl = decodeURIComponent(stateUrl);
      }

      stateUrl = this.emailVerifyService.getEmailVerifySuccessStateUrl(
        stateUrl,
        this.getUser()
      );
      this.router
        .navigateByUrl(stateUrl)
        .catch((error) =>
          console.error(`Error navigating to url: [${stateUrl}]`, error)
        );
    }
  }

  public login(targetUrl?: string): void {
    this.oauthService.initLoginFlow(targetUrl || this.router.url);
  }

  public register(targetUrl?: string): void {
    let url = targetUrl || this.router.url;
    if (url.includes('?')) {
      url = url + '&forceRegistration=true';
    } else {
      url = url + '?forceRegistration=true';
    }
    this.login(url);
  }

  public changePassword(targetUrl?: string): void {
    let url = targetUrl || this.router.url;
    if (url.includes('?')) {
      url = url + '&forceNewPassword=true';
    } else {
      url = url + '?forceNewPassword=true';
    }
    this.login(url);
  }

  public deleteAccount(targetUrl?: string): void {
    let url = targetUrl || this.router.url;
    if (url.includes('?')) {
      url = url + '&deleteAccount=true';
    } else {
      url = url + '?deleteAccount=true';
    }
    this.login(url);
  }

  hasAnyRole(user: User, userRoles: UserRole[]): boolean {
    if (userRoles?.length > 0) {
      let hasRole = false;
      userRoles.forEach((g) => {
        if (user?.roles?.indexOf(g) >= 0) {
          hasRole = true;
        }
      });
      return hasRole;
    } else {
      return true;
    }
  }

  isOrgaAdmin(user: User): boolean {
    return this.hasAnyRole(user, [UserRole.ORGANISATION_ADMIN]);
  }

  isRneAdmin(user: User): boolean {
    return this.hasAnyRole(user, [UserRole.RNE_ADMIN]);
  }

  hasAnyPermission(user: User, userPermissions: UserPermission[]): boolean {
    if (userPermissions && userPermissions.length > 0) {
      return userPermissions.reduce(
        (prev, userPermission) =>
          prev ||
          UserPermissionRoleMap[userPermission].reduce(
            (prev2, role) => prev2 || user.roles.indexOf(role) > -1,
            false
          ),
        false
      );
    } else {
      return true;
    }
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  logout(): void {
    this.oauthService.revokeTokenAndLogout();
  }

  getUser(): User | undefined {
    return this.getParams();
  }

  getCurrentCommunityId(): string | undefined {
    const params = this.getParams() || { azp: undefined };
    return params.azp;
  }

  getLastName(): string | undefined {
    const { lastName } = this.getParams() || {};
    return lastName;
  }

  getFirstName(): string | undefined {
    const { firstName } = this.getParams() || {};
    return firstName;
  }

  getEmail(): string | undefined {
    const { email } = this.getParams() || {};
    return email;
  }

  getGroups(): UserRole[] | undefined {
    const { roles } = this.getParams() || {};
    return roles;
  }

  getParams(): undefined | User {
    try {
      const identity = this.oauthService.getIdentityClaims() as Record<
        string,
        any
      >;
      if (!identity) {
        return undefined;
      }
      return identity['error']
        ? undefined
        : {
            azp: identity['azp'],
            firstName: identity['given_name'],
            lastName: identity['family_name'],
            username: identity['preferred_username'],
            email: identity['email'],
            justRegistered: identity['justRegistered'],
            roles: identity['resource_access']['wpgwn-app'].roles,
            orgWipId: identity['orgWipId'],
            orgId: identity['orgId'],
            sub: identity['sub']
          };
    } catch (e) {
      console.error(
        'Error paring jwt token: ' + this.oauthService.getIdentityClaims(),
        e
      );
      return undefined;
    }
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  async refreshToken(): Promise<void> {
    try {
      await this.oauthService.refreshToken();
    } catch (error) {
      console.error(error);
    }
  }

  userHasOrga(): boolean {
    const user = this.getUser();
    return !!user?.orgId;
  }
}
