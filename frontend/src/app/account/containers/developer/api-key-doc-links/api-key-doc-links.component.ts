
import { Component } from '@angular/core';

@Component({
  selector: 'app-api-key-doc-links',
  standalone: true,
  imports: [],
  template: `
    <div class="links">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .links {
      display: grid;
      gap: $spacing-2;
      grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    }
  `
})
export class ApiKeyDocLinksComponent {}
