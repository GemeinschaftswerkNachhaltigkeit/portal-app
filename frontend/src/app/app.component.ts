import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject, takeUntil } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { filter, map } from 'rxjs/operators';
import { Router, NavigationStart, RouterEvent, Event } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  noHeader$ = of(false);

  constructor(
    private router: Router,
    private titleService: Title,
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // in case of embeddedMap hide header
    this.noHeader$ = this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationStart),
      // Get route w/o parameters. Expression returns true if it equals '/embeddedmap'
      map((event) => (<RouterEvent>event).url.split('?')[0] === '/embeddedmap')
    );

    this.translate.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.titleService.setTitle(this.translate.instant('title'));
      });

    this.authService
      .runInitialLoginSequence()
      .catch((error: string) =>
        console.error('Error initializing OAuth module.', error)
      );
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
