import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-notifiacation-success',
  templateUrl: './notifiacation-success.component.html',
  styleUrls: ['./notifiacation-success.component.scss']
})
export class NotifiacationSuccessComponent {
  type: string;
  validTypes = ['success', 'error'];

  constructor(private router: Router, route: ActivatedRoute) {
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
