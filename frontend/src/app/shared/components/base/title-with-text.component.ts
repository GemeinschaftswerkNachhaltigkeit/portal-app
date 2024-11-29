import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardData = {
  title: string;
  description: string;
  logoUrl?: string;
};

@Component({
  selector: 'app-title-with-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="title-with-content">
      <h2 class="title">
        @if (type()) {
          <ng-container>{{ type() }}:</ng-container>
        }
        {{ title() }}
      </h2>
      <div [innerHTML]="content()"></div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .title-with-content {
      display: flex;
      flex-direction: column;
      gap: $spacing-1;
      margin-bottom: $spacing-8;
      h2 {
        font-weight: bold;
        margin: 0;
      }
    }
  `
})
export class TitleWithContentComponent {
  type = input<string | undefined>(undefined);
  title = input<string>();
  content = input<string>();
}
