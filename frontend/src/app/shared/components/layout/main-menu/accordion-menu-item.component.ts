import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';

import { MenuEntryComponent } from './menu-entry.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-accordion-menu-item',
  animations: [
    trigger('bodyExpansion', [
      state('false', style({ height: '0px', visibility: 'hidden' })),
      state('true', style({ height: '*', visibility: 'visible' })),
      transition('true <=> false', animate('300ms ease-in-out'))
    ]),
    trigger('indicatorRotate', [
      state('false', style({ transform: 'rotate(0deg)' })),
      state('true', style({ transform: 'rotate(180deg)' })),
      transition('true <=> false', animate('300ms ease-in-out'))
    ])
  ],
  standalone: true,
  imports: [CdkAccordionModule, MenuEntryComponent, MatIconModule],
  template: `
    <header (click)="toggle()" class="header">
      <app-menu-entry [button]="true" [active]="expanded" [new]="new">
        {{ title }}
      </app-menu-entry>
      <mat-icon [@indicatorRotate]="expanded">keyboard_arrow_down</mat-icon>
    </header>
    <div class="content" [@bodyExpansion]="expanded">
      <div class="content-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.12);
    }
    .content {
      overflow: hidden;
      margin-left: $spacing-8;
    }
  `
})
export class AccordionMenuItemComponent extends CdkAccordionItem {
  @Input() title = '';
  @Input() new = false;
}
