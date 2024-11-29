import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-html-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: ` <div [innerHTML]="getHtml()"></div> `
})
export class HtmlWrapperComponent {
  @Input() html = '';

  getHtml(): string {
    return this.html.replace(/&nbsp;/g, ' ');
  }
}
