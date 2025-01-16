import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OutlinedIconComponent } from '../base/outlined-icon.component';

@Component({
  selector: 'app-valid-check',
  standalone: true,
  imports: [OutlinedIconComponent],
  template: `
    @if (form.get(controlName)?.valid && form.get(controlName)?.dirty) {
      <app-outlined-icon>done</app-outlined-icon>
    }
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    :host {
      position: absolute;
      right: 0;
      color: $green;
    }
  `
})
export class ValidCheckComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
}
