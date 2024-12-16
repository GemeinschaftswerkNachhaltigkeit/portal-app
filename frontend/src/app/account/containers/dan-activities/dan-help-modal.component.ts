import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AccountContentFacadeService } from 'src/app/account/account-content-facade.service';
import { MessageInputDialogComponent } from 'src/app/shared/components/dialogs/message-input-dialog.component';

@Component({
  selector: 'app-dan-help-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [AccountContentFacadeService],
  template: `
    <div mat-dialog-content class="dan-help-modal">
      <ng-container *ngIf="content$ | async as content">
        <header class="header">
          <div class="close">
            <button mat-icon-button (click)="close()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <h1 class="title">{{ content.title || '' }}</h1>
          <p class="subtitle">{{ content.subtitle || '' }}</p>
        </header>
        <div class="content">
          <div class="left">
            <ng-container *ngFor="let entry of content.entries">
              <div class="entry" *ngIf="entry.text">
                <div class="check"><mat-icon>check</mat-icon></div>
                <div class="text" [innerHTML]="entry.text"></div>
              </div>
            </ng-container>
          </div>
          <div class="right">
            <img [src]="content.image" alt="" />
          </div>
        </div>
      </ng-container>
    </div>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        {{ 'btn.close' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .dan-help-modal {
      .header {
        background-color: $blue-light;
        padding: 2.4rem;
        display: grid;
        gap: $spacing-2;
        position: relative;
        color: $blue-navy;
        .close {
          position: absolute;
          right: 0;
          top: 0;
        }
        .title {
          font-size: 2rem;
          margin: 0;
        }
      }
      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: $spacing-8;
        padding: 2.4rem;

        .left {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: $spacing-4;
          .entry {
            display: flex;
            align-items: center;
            gap: $spacing-2;

            .check {
              color: $green;
              display: flex;
              align-items: center;
            }

            .text {
              p {
                margin: 0;
              }
            }
          }
        }

        .right {
          flex-shrink: 1;
          width: 100%;
          display: flex;
          justify-content: center;

          img {
            object-fit: contain;
            object-position: center top;
            width: 100%;
            height: 100%;
            max-width: 300px;
          }
        }
      }
    }

    @media screen and (min-width: $breakpoint-sm) {
      .dan-help-modal {
        .content {
          flex-direction: row;
          justify-content: space-between;

          .right {
            justify-content: flex-end;
          }
        }
      }
    }
  `
})
export class DanHelpModalComponent {
  content$ = this.content.danHelpModal$;

  constructor(
    public dialogRef: MatDialogRef<MessageInputDialogComponent>,
    private content: AccountContentFacadeService
  ) {}

  close() {
    this.dialogRef.close();
  }
}
