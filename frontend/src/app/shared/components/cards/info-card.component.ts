import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NewBadgeComponent } from '../base/badges/new-badge.component';
import { HeadingComponent } from '../base/heading.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule, NewBadgeComponent, HeadingComponent, RouterModule],
  template: `
    @if (extUrl !== undefined && route === undefined) {
      <a
        class="home-tile mat-elevation-z8"
        [ngClass]="{ noPadding: noPadding, noHover: noHover }"
        [style.min-height]="minHeight"
        [href]="extUrl"
        target="_blank"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    }
    @if (extUrl === undefined && route !== undefined) {
      <a
        class="home-tile mat-elevation-z8"
        [ngClass]="{ noPadding: noPadding, noHover: noHover }"
        [style.min-height]="minHeight"
        [routerLink]="route"
      >
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </a>
    }

    <ng-template #content>
      <div class="inline">
        @if (new) {
          <app-new-badge></app-new-badge>
        }
        @if (withTitle) {
          <app-heading size="md" color="blue">
            <ng-content select="[title]"></ng-content>
          </app-heading>
        }
      </div>

      <p class="description">
        <ng-content select="[body]"></ng-content>
      </p>
    </ng-template>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .home-tile {
      display: flex;
      flex-direction: column;
      gap: $spacing-4;
      padding: $spacing-8;
      background: white;
      text-decoration: none;
      height: 100%;
      transition: all 200ms;

      &:hover {
        transform: rotate(2deg);
      }

      &.noHover {
        &:hover {
          transform: none;
        }
      }

      &.noPadding {
        padding: 0;
      }

      .description {
        margin: 0;
      }

      .inline {
        display: inline-flex;
        align-items: center;
        gap: $spacing-1;
      }
    }
  `
})
export class InfoCardComponent {
  @Input() route: string[] | undefined = undefined;
  @Input() extUrl: string | undefined = undefined;
  @Input() withTitle = true;
  @Input() minHeight = 'none';
  @Input() noPadding = false;
  @Input() noHover = false;
  @Input() new? = false;
}
