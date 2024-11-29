import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import {
  DanContent,
  SignUpActivityContent,
  SignUpOrgContent
} from 'src/app/shared/services/directus-content.service';
import { HtmlWrapperComponent } from '../base/html-wrapper.component';

@Component({
  selector: 'app-form-advatages',
  standalone: true,
  imports: [CommonModule, HtmlWrapperComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bg-blue-light">
      <div class="advatages-content-wrapper">
        <app-html-wrapper [html]="content?.advantages || ''"></app-html-wrapper>
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .bg-blue-light {
      height: 100%;
      font-size: 1.25em;
    }

    .advatages-content-wrapper {
      padding: 0 $spacing-8;
      font-family: Verdana, sans-serif;
      h1,
      h2,
      h3,
      h4 {
        font-family: 'AzeretMono', monospace;
      }
    }

    .bg-blue-light {
      padding: $spacing-8 0;
      ul {
        list-style: none;
        padding: 0 0;
      }

      ul li {
        padding: 2em 0;
        display: flex;
        align-items: center;
        font-size: 1.2rem;
      }

      ul li:before {
        font-family: 'Material Icons', sans-serif;
        content: '\e876';
        font-weight: bold;
        font-size: 2em;
        padding-right: 0.25em;
      }
    }

    @media screen and (min-width: $breakpoint-xs) {
      .bg-blue-light {
        ul li {
          padding: 2em 0;
          display: flex;
          align-items: center;
          font-size: 1.6rem;
        }
      }
    }
  `
})
export class FormAdvantagesComponent {
  @Input() content:
    | SignUpOrgContent
    | SignUpActivityContent
    | DanContent
    | null = null;
}
