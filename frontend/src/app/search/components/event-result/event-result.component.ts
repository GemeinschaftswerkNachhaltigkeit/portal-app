import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Activity from 'src/app/shared/models/actvitiy';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { RouterModule } from '@angular/router';
import { EventBadgesComponent } from 'src/app/shared/components/base/badges/event-badges.component copy';
import { ContentRowComponent } from 'src/app/shared/components/base/content-row.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-event-result',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EventBadgesComponent,
    ContentRowComponent,
    TranslateModule
  ],
  templateUrl: './event-result.component.html',
  styleUrl: './event-result.component.scss'
})
export class EventResultComponent {
  @Input() event: Activity;

  utils = inject(UtilsService);
  imgService = inject(ImgService);

  logoUrl() {
    return this.imgService.url(this.event.logo);
  }
}
