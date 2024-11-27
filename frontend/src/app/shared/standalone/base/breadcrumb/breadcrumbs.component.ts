import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export type Breadcrumb = {
  path: (string | number)[];
  name: string;
};

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule],
  template: ` <ng-content></ng-content> `,
  styles: `
    @use 'theme' as *;
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: $spacing-3;
      color: $blue-navy;
    }
  `
})
export class BreadcrumbsComponent {}
