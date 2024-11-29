import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/auth/models/user';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';
import {
  NavContentService,
  NavItemContent
} from 'src/app/shared/services/nav-content.service';
import { MenuEntryComponent } from './menu-entry.component';
import { AccordionMenuItemComponent } from './accordion-menu-item.component';
import { DropdownMenuComponent } from './dropdown-menu.component';
import { OutlinedIconComponent } from '../../base/outlined-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MenuEntryComponent,
    AccordionMenuItemComponent,
    DropdownMenuComponent,
    OutlinedIconComponent,
    TranslateModule
  ]
})
export class MainMenuComponent implements OnInit {
  @Input() vertical? = false;
  @Input() mobile = false;
  @Output() closeNav = new EventEmitter();

  navContent$ = this.navContent.navContent$;

  constructor(
    private authService: AuthService,
    private navContent: NavContentService,
    public lpService: LandingpageService
  ) {}

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getUser(): User | undefined {
    return this.authService.getUser();
  }

  closeNavHandler(): void {
    this.closeNav.emit();
  }

  getUrl(item: NavItemContent): string {
    if (item.lp) {
      return this.lpService.getBaseUrl() + '/' + (item.target || item.slug);
    } else {
      return '/' + item.target;
    }
  }

  ngOnInit(): void {
    this.navContent.getNavContent();
  }
}
