import { Component, Input } from '@angular/core';
import { Color } from 'src/app/shared/models/color';
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
  @Input() type!: 'offer' | 'bestPractice';
  @Input() catgegory?: OfferCategories | BestPracticesCategories;
  @Input() expired = false;

  constructor(
    public utils: UtilsService,
    private imgService: ImgService
  ) {}

  get bgImage(): string | null {
    return this.imgService.url(this.bgImageName);
  }

  get color(): Color {
    return this.type === 'offer' ? 'bordeauxe' : 'yellow';
  }
}
