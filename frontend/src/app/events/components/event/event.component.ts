import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() clicked = new EventEmitter<{ orgaId: number; actiId: number }>();

  constructor(public utils: UtilsService) {}

  open(event: EventDto): void {
    console.log(event);
    if (event.organisation?.id && event.id) {
      this.clicked.emit({ orgaId: event.organisation?.id, actiId: event.id });
    }
  }
}
