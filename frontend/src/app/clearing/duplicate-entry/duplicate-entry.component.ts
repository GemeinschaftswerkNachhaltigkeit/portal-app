import { Component, Input } from '@angular/core';
import Organisation from 'src/app/shared/models/organisation';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';

@Component({
  selector: 'app-duplicate-entry',
  templateUrl: './duplicate-entry.component.html',
  styleUrls: ['./duplicate-entry.component.scss']
})
export class DuplicateEntryComponent {
  @Input() duplicateFields: string[] = [];
  @Input() duplicate: OrganisationWIP | Organisation | null = null;

  isDuplicateField(field: string): boolean {
    return this.duplicateFields.includes(field);
  }
}
