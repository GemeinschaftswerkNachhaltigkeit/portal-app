import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgService } from '../../../services/img.service';
import Organisation from '../../../models/organisation';
import { SharedModule } from '../../../shared.module';
import { UtilsService } from '../../../services/utils.service';
import { RouterModule } from '@angular/router';

export type CardData = {
  title: string;
  description: string;
  logoUrl?: string;
};

@Component({
  selector: 'app-orga-card',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
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
