import { Component, Input, inject } from '@angular/core';

import Organisation from 'src/app/shared/models/organisation';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { RouterModule } from '@angular/router';
import { OrgaBadgesComponent } from 'src/app/shared/components/base/badges/orga-badges.component';
import { ContentRowComponent } from 'src/app/shared/components/base/content-row.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-orga-result',
  standalone: true,
  imports: [
    RouterModule,
    OrgaBadgesComponent,
    ContentRowComponent,
    TranslateModule
],
  templateUrl: './orga-result.component.html',
  styleUrl: './orga-result.component.scss'
})
export class OrgaResultComponent {
  @Input() orga: Organisation;

  utils = inject(UtilsService);
  imgService = inject(ImgService);

  logoUrl() {
    return this.imgService.url(this.orga.logo);
  }
}
