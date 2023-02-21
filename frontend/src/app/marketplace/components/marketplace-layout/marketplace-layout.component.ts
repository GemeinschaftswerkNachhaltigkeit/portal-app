import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-marketplace-layout',
  templateUrl: './marketplace-layout.component.html',
  styleUrls: ['./marketplace-layout.component.scss']
})
export class MarketplaceLayoutComponent {
  @Input() total!: number;
  @Input() loading: boolean | null = false;

  constructor(private auth: AuthService) {}

  notAdmin(): boolean {
    const user = this.auth.getUser();
    return user && this.auth.isRneAdmin(user) ? false : true;
  }
}
