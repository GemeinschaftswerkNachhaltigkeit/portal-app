import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProfileUtilsService } from 'src/app/profile-pages/services/profile-utils.service';
import { CategoryType } from 'src/app/shared/components/category/category.component';
import LocationData from 'src/app/shared/models/location-data';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  @Input() type: 'ACTIVITY' | 'BEST_PRACTICE' | 'OFFER' | 'DAN' = 'ACTIVITY';
  @Input() title = '';
  @Input() description = '';
  @Input() sdgs?: number[];
  @Input() thematicFocus?: ThematicFocus[] = [];
  @Input() image = '';
  @Input() category = '';
  @Input() period?: {
    start: string;
    end: string;
    permanent?: boolean;
  };
  @Input() impactArea?: string;
  @Input() location?: LocationData;
  @Input() openLink?: (string | number | undefined)[];
  @Input() openTitle = '';
  @Output() bookmark = new EventEmitter();
  @Output() unbookmark = new EventEmitter();
  catType = CategoryType;

  constructor(
    public profileUtils: ProfileUtilsService,
    public imgService: ImgService,
    public utils: UtilsService,
    private translate: TranslateService
  ) {}

  isExpired(): boolean {
    if (this.type !== 'ACTIVITY') {
      return false;
    }
    return this.utils.isExpiredActivity(this.period);
  }

  getType(): CategoryType {
    if (this.type === 'OFFER') {
      return this.catType.OFFER;
    }
    if (this.type === 'BEST_PRACTICE') {
      return this.catType.BEST_PRACTISE;
    }
    if (this.type === 'ACTIVITY') {
      return this.catType.ACTIVITY;
    }
    if (this.type === 'DAN') {
      return this.catType.DAN;
    }
    return this.catType.ACTIVITY;
  }

  getThematicFocus(): string {
    if (this.thematicFocus) {
      const count = 2;
      const countString =
        this.thematicFocus.length > count
          ? `(${this.remainingThematicFocus(count)})`
          : '';
      const tf = this.thematicFocus
        ?.slice(0, count)
        .map((tf) => this.translate.instant(`thematicFocus.${tf}`));
      return `${tf.join(', ')} ${countString}`;
    }
    return '';
  }

  remainingThematicFocus(count: number): string {
    if (this.thematicFocus) {
      return this.thematicFocus.length > count
        ? `+${this.thematicFocus.length - count}`
        : '';
    } else {
      return '';
    }
  }

  bookmarkHandler(): void {
    this.bookmark.emit();
  }

  unbookmarkHandler(): void {
    this.unbookmark.emit();
  }

  showAsExpired(): boolean {
    return this.period ? this.utils.isExpiredActivity(this.period) : false;
  }

  ngOnInit(): void {
    if (this.image && this.sdgs) {
      throw new Error('You can only use either an image or sdgs!');
    }
  }
}
