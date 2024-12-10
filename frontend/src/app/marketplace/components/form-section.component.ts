import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { TextBlockComponent } from 'src/app/shared/components/base/text-block.component';

@Component({
  selector: 'app-form-section',
  standalone: true,
  imports: [CommonModule, HeadingComponent, TextBlockComponent],
  template: `
    <section class="form-section">
      <header class="header">
        <div class="header-content">
          <app-heading size="sm" color="none">{{ title }}</app-heading>
          <app-text-block
            ><p class="description">{{ description }}</p></app-text-block
          >
        </div>
      </header>

      <div class="content-wrapper" [class]="colStyle">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .form-section {
      display: grid;
      gap: $spacing-8;
      grid-template-columns: minmax(0, 1fr);
      .header {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: $spacing-8;
        .header-content {
          display: grid;
          gap: $spacing-4;
        }

        .description {
          margin: 0;
        }
      }
      .content-wrapper {
        display: grid;
        gap: $spacing-8;
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @media screen and (min-width: $breakpoint-sm) {
      .form-section {
        .header {
          &.twoCols {
            min-width: 0;
            grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
          }
        }
        .content-wrapper {
          &.twoCols {
            min-width: 0;
            grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
          }
        }
      }
    }
  `
})
export class FormSectionComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() colStyle: 'full' | 'twoCols' = 'full';
}
