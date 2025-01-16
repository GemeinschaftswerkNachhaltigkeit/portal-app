import { Component, ContentChildren, QueryList } from '@angular/core';
import { MenuItemDirective } from './menu-item.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-menu',
  standalone: true,
  imports: [CommonModule],
  template: `<nav class="page-menu highlighted-links">
    <ul class="content">
      @for (item of listItems; track item) {
        <li class="entry">
          <ng-container [ngTemplateOutlet]="item.itemTemplate"></ng-container>
        </li>
      }
    </ul>
  </nav>`,
  styles: `
    @use '@angular/material' as mat;
    @use 'palette' as *;
    @use 'theme' as *;

    .page-menu {
      background-color: transparent;
      box-shadow: 14rem 0 0 0 $blue-light inset;
      font-size: 1.2rem;
      padding: 0 $spacing-2 0 3rem;
      .content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
        position: relative;
        top: -1rem;
        list-style-type: none;
      }
    }

    @media screen and (min-width: $breakpoint-md) {
      .page-menu {
        padding: 0 $spacing-2 $spacing-20 3rem;
        padding-left: 0rem;
      }
    }
  `
})
export class PageMenuComponent {
  @ContentChildren(MenuItemDirective)
  listItems: QueryList<MenuItemDirective> | null = null;
}
