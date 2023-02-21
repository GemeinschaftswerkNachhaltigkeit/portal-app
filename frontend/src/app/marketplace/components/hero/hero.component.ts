import { Component, Input } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ImgService } from '../../../shared/services/img.service';
import { BestPracticesCategories } from '../../models/best-practices-categories';
import { OfferCategories } from '../../models/offer-categories';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Input() bgImageName!: string;
  @Input() catgegory?: OfferCategories | BestPracticesCategories;

  constructor(public utils: UtilsService, private imgService: ImgService) {}

  get bgImage(): string | null {
    return this.imgService.url(this.bgImageName);
  }
}
