import { Component, Input } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/utils.service';
import Type from '../../../shared/models/type';
import { ImgService } from '../../../shared/services/img.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Input() bgImageName? = '';
  @Input() name? = '';
  @Input() logo? = '';
  @Input() types?: Type = {};
  @Input() dan = false;
  @Input() organisationTypeLabel? = '';
  @Input() activityTypeLabel? = '';
  @Input() period?: {
    start: string;
    end: string;
  };
  @Input() isExpired = false;

  constructor(public utils: UtilsService, private imgService: ImgService) {}
}
