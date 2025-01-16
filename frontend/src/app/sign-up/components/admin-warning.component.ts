import { Component } from '@angular/core';
import { OutlinedIconComponent } from '../../shared/components/base/outlined-icon.component';

@Component({
  selector: 'app-admin-warning',
  standalone: true,
  imports: [OutlinedIconComponent],
  template: `
    <div class="admin-warning">
      <app-outlined-icon>warning</app-outlined-icon>
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .admin-warning {
      padding: 2em;
      display: flex;
      align-items: center;
      background-color: $magenta;
      color: white;

      app-outlined-icon {
        margin-right: 2em;
      }
    }
  `
})
export class AdminWarningComponent {}
