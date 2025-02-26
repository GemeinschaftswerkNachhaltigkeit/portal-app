import { Component, Input, inject } from '@angular/core';

import { ImgService } from '../../../services/img.service';
import { UtilsService } from '../../../services/utils.service';
import Activity from '../../../models/actvitiy';
import { RouterModule } from '@angular/router';
import { EventBadgesComponent } from '../../base/badges/event-badges.component copy';
import { OutlinedIconComponent } from '../../base/outlined-icon.component';

export type CardData = {
  title: string;
  description: string;
  logoUrl?: string;
};

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [OutlinedIconComponent, RouterModule, EventBadgesComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  @Input() event: Activity;

  utils = inject(UtilsService);
  imgService = inject(ImgService);

  logoUrl() {
    return this.imgService.url(this.event.logo);
  }
}
