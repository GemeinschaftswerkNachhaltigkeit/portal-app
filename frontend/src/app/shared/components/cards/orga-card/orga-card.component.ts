import { Component, Input, inject } from '@angular/core';

import { ImgService } from '../../../services/img.service';
import Organisation from '../../../models/organisation';
import { UtilsService } from '../../../services/utils.service';
import { RouterModule } from '@angular/router';
import { OrgaBadgesComponent } from '../../base/badges/orga-badges.component';
import { OutlinedIconComponent } from '../../base/outlined-icon.component';
import { TranslateModule } from '@ngx-translate/core';

export type CardData = {
  title: string;
  description: string;
  logoUrl?: string;
};

@Component({
  selector: 'app-orga-card',
  standalone: true,
  imports: [
    OutlinedIconComponent,
    RouterModule,
    OrgaBadgesComponent,
    TranslateModule
  ],
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
