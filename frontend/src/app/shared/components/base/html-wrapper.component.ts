import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-html-wrapper',
  standalone: true,
  imports: [],
  template: ` <div [innerHTML]="getHtml()"></div> `
})
export class HtmlWrapperComponent {
  @Input() html = '';

  getHtml(): string {
    return this.html.replace(/&nbsp;/g, ' ');
  }
}
