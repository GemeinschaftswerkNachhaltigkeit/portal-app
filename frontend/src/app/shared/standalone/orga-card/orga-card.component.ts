import { Component, HostBinding, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from 'src/app/map/services/card.service';
import { ImgService } from '../../services/img.service';
import Organisation from '../../models/organisation';
import { SharedModule } from '../../shared.module';
import { UtilsService } from '../../services/utils.service';

export type CardData = {
  title: string;
  description: string;
  logoUrl?: string;
};

@Component({
  selector: 'app-orga-card',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './orga-card.component.html',
  styleUrl: './orga-card.component.scss'
})
export class OrgaCardComponent {
  @Input() orga: Organisation;

  utils = inject(UtilsService);
  imgService = inject(ImgService);

  logoUrl() {
    return this.imgService.url(this.orga.logo);
  }
}
