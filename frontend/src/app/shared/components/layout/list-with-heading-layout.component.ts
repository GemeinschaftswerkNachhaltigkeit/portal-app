
import { Component, Input } from '@angular/core';
import { HeadingComponent } from '../base/heading.component';

@Component({
  selector: 'app-list-with-heading-layout',
  standalone: true,
  imports: [HeadingComponent],
  template: `
    <section class="list-wrapper">
      <app-heading type="h3" size="sm" color="none">{{ title }}</app-heading>
      <div>
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .list-wrapper {
      display: grid;
      gap: $spacing-4;
    }
  `
})
export class ListWithHeadingLayoutComponent {
  @Input() title = '';
}
