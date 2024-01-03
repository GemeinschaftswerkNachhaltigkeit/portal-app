import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Organisation from 'src/app/shared/models/organisation';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orga-result',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
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
