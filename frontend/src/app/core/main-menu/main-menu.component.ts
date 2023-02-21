import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/auth/models/user';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  @Input() vertical? = false;
  @Input() mobile = false;
  @Output() closeNav = new EventEmitter();

  constructor(
    private authService: AuthService,
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
}
