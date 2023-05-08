import { Component, ContentChildren, QueryList } from '@angular/core';
import { MenuItemDirective } from './menu-item.directive';

@Component({
  selector: 'app-page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.scss']
})
export class PageMenuComponent {
  @ContentChildren(MenuItemDirective)
  listItems: QueryList<MenuItemDirective> | null = null;
}
