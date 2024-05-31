import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InfoDialogComponent } from 'src/app/shared/standalone/dialogs/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-type-tab',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    InfoDialogComponent
  ],
  templateUrl: './type-tab.component.html',
  styleUrl: './type-tab.component.scss'
})
export class TypeTabComponent {
  info = input('');

  dialog = inject(MatDialog);

  handleInfoClick(event: MouseEvent): void {
    event.stopPropagation();
    this.openInfo();
  }

  openInfo() {
    this.dialog.open(InfoDialogComponent, {
      width: '700px',
      data: {
        content: this.info()
      }
    });
  }
}
