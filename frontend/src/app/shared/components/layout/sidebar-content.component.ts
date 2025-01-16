import { Component, EventEmitter, Output } from '@angular/core';
import { LogoComponent } from './logo.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NavActionsComponent } from './nav-actions.component';

@Component({
  selector: 'app-sidebar-content',
  standalone: true,
  imports: [LogoComponent, MainMenuComponent, NavActionsComponent],
  template: `<div class="sidebar-content">
    <div class="logo-wrapper">
      <app-logo></app-logo>
    </div>
    <app-main-menu
      [vertical]="true"
      (closeNav)="closeHandler()"
      [mobile]="true"
    ></app-main-menu>
    <div class="separator"></div>
    <app-nav-actions [mobile]="true"></app-nav-actions>
  </div> `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .sidebar-content {
      height: 100%;
      padding: 2rem 2rem;
      display: flex;
      flex-direction: column;

      .separator {
        height: 2px;
        background-color: $blue-navy;
        margin: $spacing-8 0;
      }

      .logo-wrapper {
        height: 7rem;
      }
    }
  `
})
export class SidebarContentComponent {
  @Output() closeNav = new EventEmitter();

  closeHandler() {
    this.closeNav.emit();
  }
}
