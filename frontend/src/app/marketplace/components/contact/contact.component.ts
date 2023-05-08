import { Component, Input } from '@angular/core';
import { Contact } from 'src/app/shared/models/contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  @Input() contact!: Contact;
  @Input() type!: 'offer' | 'bestPractice';
  @Input() orga!: {
    id: number;
    name: string;
  };
  showContact = false;

  toggleShowContact(): void {
    this.showContact = true;
  }

  getName(contact: Contact): string {
    return `${contact.firstName} ${contact.lastName}`;
  }
}
