import { Component } from '@angular/core';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [],
  template: `
    <div class="topic">
      <span><ng-content></ng-content></span>
    </div>
  `,
  styles: `
    @use '@angular/material' as mat;
    @use 'palette' as *;
    @use 'theme' as *;

    .topic {
      span {
        font-size: 1.2rem;
        padding: $spacing-1;
        box-decoration-break: clone;
        line-height: 2.4rem;
        background-color: $blue-navy;
        color: white;
      }
    }
  `
})
export class TopicComponent {}
