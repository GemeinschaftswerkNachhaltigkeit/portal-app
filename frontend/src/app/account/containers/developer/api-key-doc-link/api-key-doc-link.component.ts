
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { InfoCardComponent } from 'src/app/shared/components/cards/info-card.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-api-key-doc-link',
  standalone: true,
  imports: [InfoCardComponent, MatIconModule],
  template: `
    <app-info-card [extUrl]="getUrl()" [withTitle]="false" [noPadding]="true">
      <div class="doc-link" body>
        <mat-icon class="icon">article</mat-icon>
        <div class="label"><ng-content></ng-content></div>
        <mat-icon class="link-icon">launch</mat-icon>
      </div>
    </app-info-card>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .doc-link {
      display: grid;
      grid-template-columns: 2rem 1fr;
      font-size: 1.4rem;
      gap: $spacing-2;
      height: 8rem;
      padding: $spacing-2;
      font-weight: bold;
      position: relative;
      text-decoration: none;

      .label {
        position: relative;
        top: 1px;
      }
      .link-icon {
        position: absolute;
        right: $spacing-2;
        bottom: $spacing-2;
        opacity: 0.5;
      }
    }
  `
})
export class ApiKeyDocLinkComponent {
  @Input() absouteUrl = false;
  @Input() url = '';

  getUrl(): string {
    if (this.absouteUrl) {
      return this.url;
    }
    return environment.contextPath + this.url;
  }
}
