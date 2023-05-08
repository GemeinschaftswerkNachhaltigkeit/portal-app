import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CardService } from 'src/app/map/services/card.service';
import { Color } from 'src/app/shared/models/color';
import LocationData from 'src/app/shared/models/location-data';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MarketplaceTypes } from '../../models/marketplace-type';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() imageId?: string;
  @Input() title!: string;
  @Input() content!: string;
  @Input() location?: LocationData;
  @Input() thematicFocus: ThematicFocus[] = [];
  @Input() type?: MarketplaceTypes;
  @Input() category = '';
  @Input() showActions? = true;
  @Input() clickable? = true;
  @Input() draft? = false;
  @Input() featured? = false;
  @Input() featuredText? = '';

  @Output() cardClicked = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(
    public card: CardService,
    public utils: UtilsService,
    public imgService: ImgService,
    private translate: TranslateService
  ) {}

  typeColor(type: string): Color {
    switch (type) {
      case MarketplaceTypes.OFFER:
        return 'bordeauxe';
      case MarketplaceTypes.BEST_PRACTISE:
        return 'yellow';
      default:
        return 'primary';
    }
  }

  getFormattedThematicFocus(): string {
    return (
      this.thematicFocus
        ?.map((f) => this.translate.instant('thematicFocus.' + f))
        .join(', ') || ''
    );
  }

  hasAddress(location: LocationData): boolean {
    return !this.utils.noLocation(location);
  }

  cardClickHandler(): void {
    this.cardClicked.emit();
  }

  editHandler(): void {
    this.edit.emit();
  }

  deleteHandler(): void {
    this.delete.emit();
  }
}
