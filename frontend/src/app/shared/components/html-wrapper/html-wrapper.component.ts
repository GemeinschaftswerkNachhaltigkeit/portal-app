import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-html-wrapper',
  templateUrl: './html-wrapper.component.html',
  styleUrls: ['./html-wrapper.component.scss']
})
export class HtmlWrapperComponent {
  @Input() html = '';

  getHtml(): string {
    return this.html.replace(/&nbsp;/g, ' ');
  }
}
