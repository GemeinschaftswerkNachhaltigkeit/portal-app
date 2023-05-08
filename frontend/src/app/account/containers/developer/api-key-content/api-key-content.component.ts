import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-api-key-content',
  templateUrl: './api-key-content.component.html',
  styleUrls: ['./api-key-content.component.scss']
})
export class ApiKeyContentComponent {
  @Input() apiKey = '';

  visible = false;
  copied = false;
  timer: ReturnType<typeof setTimeout> | undefined;

  toggle(): void {
    this.visible = !this.visible;
  }

  copyHandler(): void {
    if (this.apiKey && this.visible) {
      navigator.clipboard.writeText(this.apiKey);
      this.showCopied();
    }
  }

  private showCopied(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.copied = true;
    this.timer = setTimeout(() => {
      this.copied = false;
    }, 3000);
  }

  getDots(apiKey = ''): string[] {
    return new Array(apiKey.length);
  }
}
