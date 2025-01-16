import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-api-key-content',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule, MatButtonModule],
  template: `
    <div class="api-key" [ngClass]="{ noKey: !apiKey }">
      @if (apiKey) {
        <div class="key" (click)="copyHandler()">
          @if (visible) {
            <div class="key-text">
              <div>{{ apiKey }}</div>
              <div class="copied">
                @if (copied) {
                  {{ 'labels.copied' | translate }}
                } @else {
                  <mat-icon>file_copy</mat-icon>
                }
              </div>
            </div>
          } @else {
            <div class="dots">
              @for (dot of getDots(apiKey); track dot) {
                <div class="dot"></div>
              }
            </div>
          }
          <ng-template #dots>
            <div class="dots">
              @for (dot of getDots(apiKey); track dot) {
                <div class="dot"></div>
              }
            </div>
          </ng-template>
        </div>
      }
      @if (apiKey) {
        <button mat-icon-button (click)="toggle()">
          @if (visible) {
            <mat-icon>visibility_off</mat-icon>
          } @else {
            <mat-icon>visibility</mat-icon>
          }
        </button>
      }
      @if (!apiKey) {
        <span class="placeholder">{{
          'account.labels.noApiKey' | translate
        }}</span>
      }
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .api-key {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &.noKey {
        justify-content: flex-start;
      }

      .dots {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 2px;
        .dot {
          width: 0.4rem;
          height: 0.4rem;
          background-color: $blue-navy;
          border-radius: 50%;
        }
      }

      .key {
        font-size: 1.2rem;
        font-weight: bold;
        line-height: 1.2rem;
        cursor: pointer;

        .key-text {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: $spacing-2;

          .key-value {
            white-space: nowrap;
          }

          .copied {
            font-size: 1.2rem;
            background-color: #f3f3f3;
            padding: $spacing-1;
          }
        }
      }

      .placeholder {
        opacity: 0.5;
        height: 4rem;
        line-height: 4rem;
      }
    }

    @media screen and (min-width: $breakpoint-xs) {
      .api-key {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .dots {
          display: flex;
          flex-wrap: nowrap;
          width: 468px;
          justify-content: space-between;
          gap: 0;
          .dot {
            width: 1rem;
            height: 1rem;
          }
        }

        .key {
          font-size: 2rem;
          line-height: 2rem;
        }

        .placeholder {
          font-size: 2rem;
        }
      }
    }
  `
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
