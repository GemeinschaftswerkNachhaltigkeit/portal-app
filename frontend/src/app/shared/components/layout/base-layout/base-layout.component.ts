import { Component, Input, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';
import { CommonModule } from '@angular/common';
import { MainHeaderComponent } from '../main-header.component';
import { FooterComponent } from '../footer.component';
import { SidebarContentComponent } from '../sidebar-content.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MainHeaderComponent,
    FooterComponent,
    SidebarContentComponent,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule
  ]
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
      .observe('(min-width: 1600px)')
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
