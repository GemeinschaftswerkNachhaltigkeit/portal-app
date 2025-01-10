import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewBadgeComponent } from '../../base/badges/new-badge.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-entry',
  standalone: true,
  imports: [CommonModule, NewBadgeComponent, RouterModule],
  template: `
    <div
      class="menu-entry-wrapper mat-button"
      [ngClass]="{ underline: underline, last: last }"
    >
      <app-new-badge *ngIf="new"></app-new-badge>
      <a
        *ngIf="button; else link"
        class="menu-entry font-2"
        [ngClass]="{ blue: blue, isActive: active }"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    </div>

    <ng-template #external>
      <a [href]="url" class="menu-entry font-2" [ngClass]="{ blue: blue }">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    </ng-template>

    <ng-template #link>
      <a
        *ngIf="internal; else external"
        (click)="clickHandler()"
        [routerLink]="[url]"
        [routerLinkActive]="'active'"
        class="menu-entry font-2"
        [ngClass]="{ blue: blue }"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    </ng-template>

    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .menu-entry-wrapper {
      display: flex;
      align-items: center;
      padding: $spacing-4 0;
      a {
        text-transform: uppercase;
        font-weight: 600;
        height: 2rem;
        line-height: 2rem;
        gap: $spacing-2;
        display: flex;
      }

      &.underline:not(.last) {
        box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.12) inset;
      }
    }
  `
})
export class MenuEntryComponent {
  @Input() url = '';
  @Input() internal = true;
  @Input() underline = false;
  @Input() last = false;
  @Input() button = false;
  @Input() blue = false;
  @Input() active = false;
  @Input() new = false;

  @Output() routeClicked = new EventEmitter();

  clickHandler(): void {
    this.routeClicked.emit();
  }
}
