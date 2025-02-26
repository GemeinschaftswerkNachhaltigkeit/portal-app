import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeadingComponent } from '../../base/heading.component';
import { TranslateModule } from '@ngx-translate/core';
import { HtmlWrapperComponent } from '../../base/html-wrapper.component';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    HeadingComponent,
    TranslateModule,
    HtmlWrapperComponent
  ]
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
