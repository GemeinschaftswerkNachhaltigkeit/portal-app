import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, HeadingComponent],
  template: `
    <article class="content-section">
      <header class="header">
        <div class="subtitle-wrapper">
          <h3 class="subtitle">{{ subtitle }}</h3>
          <p
            class="info"
            [ngClass]="{
              activity: infoType === 'ACTIVITY',
              organisation: infoType === 'ORGANISATION'
            }"
          >
            {{ info }}
          </p>
        </div>

        <div class="title-wrapper">
          <app-heading type="h2" size="xl" color="blue">{{
            title
          }}</app-heading>
          <ng-content select="[badge]"></ng-content>
        </div>
      </header>
      <div class="body">
        <ng-content></ng-content>
      </div>
    </article>
  `,
  styles: `
    @use '@angular/material' as mat;
    @use 'palette' as *;
    @use 'theme' as *;

    .content-section {
      display: grid;
      gap: $spacing-8;

      .header {
        .title {
          font-size: 3.2rem;
          font-family: 'AzeretMono', monospace;
          font-weight: 800;
          margin: 0;
        }

        .title-wrapper {
          display: grid;
          gap: $spacing-4;
        }

        .subtitle-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;

          .subtitle {
            color: $magenta;
            font-size: 1.2rem;
            margin-bottom: $spacing-2;
            text-transform: uppercase;
          }
          .info {
            color: $gray;
            font-size: 1.2rem;
            justify-self: flex-end;

            &.activity {
              color: $green;
            }
            &.organisation {
              color: $orange;
            }
          }
        }
      }

      mark {
        box-decoration-break: clone;
        background: transparent;
        box-shadow:
          0 -16px 0 inset $blue-light,
          0 6px 0 $blue-light;
        color: $blue-navy;
        position: relative;
        z-index: $z1;
        padding: 0 $spacing-2;
        margin: 0 (-$spacing-2);
      }
    }
  `
})
export class SectionComponent {
  @Input() subtitle? = '';
  @Input() info? = '';
  @Input() infoType?: 'ORGANISATION' | 'ACTIVITY' = 'ORGANISATION';
  @Input() title? = '';
}
