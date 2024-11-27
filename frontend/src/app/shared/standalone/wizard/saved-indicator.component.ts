import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SavedService } from '../../services/saved.service';
import { OutlinedIconComponent } from '../base/outlined-icon.component';

@Component({
  selector: 'app-saved-indicator',
  styles: [
    `
      @use 'theme' as *;
      @use 'palette' as *;

      div {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        height: $spacing-9;
      }
    `
  ],
  template: `
    @if (saved()) {
      <div>
        <app-outlined-icon>cloud_done</app-outlined-icon>
        {{ 'labels.saved' | translate }}
      </div>
    }
  `,
  standalone: true,
  imports: [CommonModule, OutlinedIconComponent, TranslateModule]
})
export class SavedIndicatorComponent {
  savedService = inject(SavedService);

  saved = this.savedService.saved;
}
