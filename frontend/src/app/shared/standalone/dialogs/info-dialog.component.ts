import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-info-dialog',
  template: `
    <div mat-dialog-content [innerHTML]="data.content" class="content"></div>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        {{ 'btn.close' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .content {
      color: $blue-navy;
      line-height: 1.5;
    }
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, MatButtonModule]
})
export class InfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      content: string;
    }
  ) {}

  confirm(): void {
    this.dialogRef.close();
  }
}
