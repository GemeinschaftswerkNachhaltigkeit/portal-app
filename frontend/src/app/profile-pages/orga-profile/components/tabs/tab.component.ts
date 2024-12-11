import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule],
  styles: [``],
  template: `
    <ng-template #tabTemplate>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class TabComponent {
  @Input() title = '';
  @ViewChild('tabTemplate')
  template: TemplateRef<TabComponent> | null = null;
}
