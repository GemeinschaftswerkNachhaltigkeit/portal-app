import { Component, Input } from '@angular/core';
import EventDto from '../../models/event-dto';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @Input() event!: EventDto;
  @Input() last = false;

  constructor(public utils: UtilsService) {}

  open(): void {
    alert('open');
  }
}
