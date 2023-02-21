import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-valid-check',
  templateUrl: './valid-check.component.html',
  styleUrls: ['./valid-check.component.scss']
})
export class ValidCheckComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
}
