import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationPageComponent } from 'src/app/shared/components/layout/notification-page/notification-page.component';

@Component({
  selector: 'app-notifiacation-success',
  standalone: true,
  imports: [NotificationPageComponent, TranslateModule],
  template: `
    @if (isValidType()) {
      <app-notification-page
        [title]="getTitle() | translate"
        [content]="getContent() | translate"
        [icon]="getIcon()"
        [buttonText]="'btn.goToApp'"
        (continue)="close()"
      >
      </app-notification-page>
    }
  `
})
export class NotifiacationSuccessComponent {
  type: string;
  validTypes = ['success', 'error'];

  constructor(
    private router: Router,
    route: ActivatedRoute
  ) {
    this.type = route.snapshot.queryParams['type'] || 'success';
    if (!this.isValidType()) {
      this.close();
    }
  }

  isValidType(): boolean {
    return this.validTypes.includes(this.type);
  }

  getTitle(): string {
    return 'account.titles.notifications.' + this.type;
  }

  getContent(): string {
    return 'account.texts.notifications.' + this.type;
  }

  getIcon(): string {
    if (this.type === 'success') {
      return 'check';
    }
    if (this.type === 'error') {
      return 'error';
    }
    return '';
  }

  close(): void {
    this.router.navigate(['/']);
  }
}
