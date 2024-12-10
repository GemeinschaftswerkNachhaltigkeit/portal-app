import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-form-section-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="sections">
      <ng-content></ng-content>
    </section>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .sections {
      display: grid;
      gap: $spacing-8;
    }
  `
})
export class FormSectionListComponent {}
