/*  eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@angular/core';
import {
  UserPermission,
  UserPermissionRoleMap,
  UserRole
} from '../models/user-role';
import { User } from '../models/user';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
  Subject
} from 'rxjs';
import { AuthConfigService } from './auth-config.service';
import { AuthConfig, OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { filter, map } from 'rxjs/operators';
import { EmailVerifySuccessService } from './email-verify-success.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private tokenRefreshSubject$ = new Subject();
  public tokenRefresh$ = this.tokenRefreshSubject$.asObservable();

  private isDoneLoadingSubject$ = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  private silentRefreshErrors = 0;

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private emailVerifyService: EmailVerifySuccessService,
    @Inject(AuthConfigService) private config: AuthConfig
  ) {
    oauthService.configure(config);

    // Useful for debugging:
    // todo: remove when everything works
    this.oauthService.events.subscribe((event) => {
      if (event instanceof OAuthErrorEvent) {
        // console.error('OAuthErrorEvent Object:', event);
      } else {
        if (event.type === 'token_refreshed') {
          this.tokenRefreshSubject$.next(null);
        }
      }
    });

    // This is tricky, as it might cause race conditions (where access_token is set in another
    // tab before everything is said and done there.
    // TODO: Improve this setup. See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    window.addEventListener('storage', (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
      );
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });

    this.oauthService.events.subscribe(() => {
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });

    this.oauthService.events
      .pipe(filter((e) => ['token_received'].includes(e.type)))
      .subscribe(() => this.oauthService.loadUserProfile());

    this.oauthService.events
      .pipe(
        filter((e) => ['session_terminated', 'session_error'].includes(e.type))
      )
      .subscribe(() => this.navigateToLoginPage());

    this.oauthService.setupAutomaticSilentRefresh();
  }

  private navigateToLoginPage(): void {
    // TODO: Remember current URL
    this.router
      .navigateByUrl('/')
      .catch((error) => console.error('Error navigating to "/".', error));
  }

  /**
   * Publishes `true` if and only if (a) all the asynchronous initial
   * login calls have completed or errorred, and (b) the user ended up
   * being authenticated.
   *
   * In essence, it combines:
   *
   * - the latest known state of whether the user is authorized
   * - whether the ajax calls for initial log in have all been done
   */
  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$
  ]).pipe(map((values) => values.every((b) => b)));

  public runInitialLoginSequence(): Promise<void> {
    // 0. LOAD CONFIG:
    // First we have to check to see how the IdServer is
    // currently configured:
    return (
      this.oauthService
        .loadDiscoveryDocument()
        // 1. HASH LOGIN:
        // Try to log in via hash fragment after redirect back
        // from IdServer from initImplicitFlow:
        .then(() => this.oauthService.tryLogin())

        .then(() => {
          if (this.oauthService.hasValidAccessToken()) {
            return Promise.resolve();
          }

          // 2. SILENT LOGIN:
          // Try to log in via a refresh because then we can prevent
          // needing to redirect the user:
          return this.oauthService
            .silentRefresh()
            .then(() => {
              return Promise.resolve();
            })
            .catch((result) => {
              // Subset of situations from https://openid.net/specs/openid-connect-core-1_0.html#AuthError
              // Only the ones where it's reasonably sure that sending the
              // user to the IdServer will help.
              const errorResponsesRequiringUserInteraction = [
                'interaction_required',
                'login_required',
                'account_selection_required',
                'consent_required'
              ];

              console.log('Auth error', result);

              if (
                result &&
                result.reason &&
                errorResponsesRequiringUserInteraction.indexOf(
                  result.reason.params.error
                ) >= 0
              ) {
                // 3. ASK FOR LOGIN:
                // At this point we know for sure that we have to ask the
                // user to log in, so we redirect them to the IdServer to
                // enter credentials.
                //
                // Enable this to ALWAYS force a user to login.
                // this.login();

                // if the token is expired and we cannot log, we logout to delete the token from the local storage
                // to prevent it from being sent to the backend. An expired token will always return 401 even if the
                // endpoint is unsecured.
                if (!this.oauthService.hasValidAccessToken()) {
                  console.log('Invalid token');
                  this.oauthService.logOut(true);
                }

                // Instead, we'll now do this:
                // console.warn(
                //   'User interaction is needed to log in, we will wait for the user to manually log in.'
                // );
                return Promise.resolve();
              } else {
                console.log('Unhandled error - Log out');
                this.oauthService.logOut(true);
              }

              // We can't handle the truth, just pass on the problem to the
              // next handler.
              return Promise.reject(result);
            });
        })
        .then(() => {
          // Check for the strings 'undefined' and 'null' just to be sure. Our current
          // login(...) should never have this, but in case someone ever calls
          // initImplicitFlow(undefined | null) this could happen.

          if (
            this.oauthService.state &&
            this.oauthService.state !== 'undefined' &&
            this.oauthService.state !== 'null'
          ) {
            let stateUrl = this.oauthService.state;
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
        })
        .finally(() => this.isDoneLoadingSubject$.next(true))
    );
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

  public isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  logout(): void {
    this.oauthService.logOut();
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
      if (this.silentRefreshErrors < 5) {
        await this.oauthService.silentRefresh();
      } else {
        await this.oauthService.refreshToken();
      }
    } catch (e) {
      console.debug('Silent refresh error -> fallback to normal token refresh');
      this.silentRefreshErrors++;
      await this.oauthService.refreshToken();
    }
  }

  userHasOrga(): boolean {
    const user = this.getUser();
    return !!user?.orgId;
  }
}
