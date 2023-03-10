import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  constructor(
    private titleService: Title,
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
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
