import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MenuEntryComponent } from './menu-entry.component';
import { MatIconModule } from '@angular/material/icon';
import { CdkMenuModule } from '@angular/cdk/menu';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule, MenuEntryComponent, MatIconModule, CdkMenuModule],
  template: `
    <div
      [cdkMenuTriggerFor]="menu"
      (click)="toggle()"
      class="dropdown-wrapper"
      [ngClass]="{ open: open }"
    >
      <app-menu-entry [button]="true" [new]="new">
        <div class="wrapper">
          <div>{{ title }}</div>
          <div class="icon" [ngClass]="{ open: open }">
            <mat-icon>expand_more</mat-icon>
          </div>
        </div>
      </app-menu-entry>
    </div>

    <ng-template #menu>
      <div
        class="dropdown-menu highlighted-links mat-elevation-z8"
        cdkMenu
        (closed)="setClosed()"
      >
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  styles: `
    @use 'theme' as *;
    .dropdown-wrapper {
      &.open {
        pointer-events: none;
      }
    }
    .dropdown-menu {
      background-color: white;
      padding: 0 $spacing-4;
    }
    .wrapper {
      display: flex;
      align-items: center;
      gap: $spacing-2;

      .icon {
        transform: rotate(0);
        transition: transform 200ms;
        display: flex;
        align-items: center;
        justify-content: center;
        &.open {
          transform: rotate(-180deg);
        }
      }
    }
  `
})
export class DropdownMenuComponent {
  @Input() new = false;
  @Input() title = '';
  open = false;

  toggle() {
    this.open = !this.open;
  }
  setClosed() {
    this.open = false;
  }
}
