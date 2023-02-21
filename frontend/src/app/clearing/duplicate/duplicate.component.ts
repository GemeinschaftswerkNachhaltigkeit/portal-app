import { Component, Input } from '@angular/core';
import DuplicateDto from '../models/duplicate-dto';

@Component({
  selector: 'app-duplicate',
  templateUrl: './duplicate.component.html',
  styleUrls: ['./duplicate.component.scss']
})
export class DuplicateComponent {
  @Input() duplicate: DuplicateDto | null = null;
}
