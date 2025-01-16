import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentWrapperComponent } from './content-wrapper.component';
import { LogoComponent } from './logo.component';
import { NavActionsComponent } from './nav-actions.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [
    ContentWrapperComponent,
    LogoComponent,
    NavActionsComponent,
    MainMenuComponent
  ],
  template: `
    <header
      class="header mat-elevation-z8"
      [class.mobile]="mobile"
      role="banner"
    >
      <app-content-wrapper [onlyX]="true">
        <div class="header-content">
          <div class="left-content">
            <app-logo></app-logo>
            @if (!mobile) {
              <app-main-menu></app-main-menu>
            }
          </div>
          <div class="actions">
            @if (!mobile) {
              <app-nav-actions></app-nav-actions>
            }
          </div>
        </div>
      </app-content-wrapper>
    </header>
  `,
  styles: `
    @use 'theme' as *;
    :host {
      width: 100%;
    }
    .header {
      display: flex;
      height: $top-nav-height;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      z-index: 1000;
      background: white;

      .header-content {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left-content {
          display: flex;
          align-items: center;
          gap: $spacing-4;
          flex-grow: 1;
        }
      }
    }

    @media screen and (min-width: $breakpoint-mobile-menu) {
      .header {
        position: fixed;
      }
    }
  `
})
export class MainHeaderComponent {
  @Input() mobile = false;
  @Input() open = false;
  @Output() openToggled = new EventEmitter<boolean>();

  toggleOpen(): void {
    this.openToggled.emit(!this.open);
  }
}
