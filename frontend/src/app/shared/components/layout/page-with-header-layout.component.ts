
import { Component, Input } from '@angular/core';
import { HeaderComponent } from './header.component';
import { AlertComponent } from '../base/alert.component';

@Component({
  selector: 'app-page-with-header-layout',
  standalone: true,
  imports: [HeaderComponent, AlertComponent],
  template: `
    <app-header [title]="title" [firstName]="firstName">
      <ng-content select="[headerContent]"></ng-content>
      <ng-content action select="[headerAction]"></ng-content>
    </app-header>
    
    @if (showNoEntriesWarning) {
      <app-alert [title]="noEntriesTitle">
        <ng-content select="[noEntriesContent]"></ng-content>
      </app-alert>
    }
    
    <ng-content></ng-content>
    `
})
export class PageWithHeaderLayoutComponent {
  @Input() title = '';
  @Input() firstName? = '';
  @Input() noEntriesTitle = '';
  @Input() showNoEntriesWarning = false;
}
