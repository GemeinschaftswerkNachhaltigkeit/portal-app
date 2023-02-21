import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-section',
  templateUrl: './form-section.component.html',
  styleUrls: ['./form-section.component.scss']
})
export class FormSectionComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() colStyle: 'full' | 'twoCols' = 'full';
}
