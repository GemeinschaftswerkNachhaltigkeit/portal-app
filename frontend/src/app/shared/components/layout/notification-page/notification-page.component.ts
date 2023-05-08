import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss']
})
export class NotificationPageComponent {
  @Input() advantagesTitle? = '';
  @Input() title? = '';
  @Input() content? = '';
  @Input() advantages?: string[] = [];
  @Input() icon? = 'check';
  @Input() iconColor? = '';
  @Input() buttonText = 'emailVerifySuccessPage.buttons.continue';

  @Output() continue = new EventEmitter<void>();

  continueHandler(): void {
    this.continue.emit();
  }
}
