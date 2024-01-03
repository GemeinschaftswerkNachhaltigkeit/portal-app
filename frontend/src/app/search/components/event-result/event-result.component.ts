import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Activity from 'src/app/shared/models/actvitiy';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-result',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
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
