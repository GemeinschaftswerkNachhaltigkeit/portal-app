import { Component, Input, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent implements OnDestroy {
  @Input() noHeader = false;

  destroyed = new Subject<void>();
  mobile = false;

  constructor(
    public lpService: LandingpageService,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe('(min-width: 1480px)')
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        this.mobile = !result.matches;
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
