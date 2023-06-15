import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { UtilsService } from 'src/app/shared/services/utils.service';

import { CardService } from '../../../map/services/card.service';
import Activity from '../../models/actvitiy';
import Organisation from '../../models/organisation';

@Component({
  selector: 'app-base-card',
  templateUrl: './base-card.component.html',
  styleUrls: ['./base-card.component.scss']
})
export class BaseCardComponent implements AfterViewChecked {
  @Input() entity?: Organisation | Activity;
  @Input() type?: string;
  @Input() isActive? = false;
  @Input() followed? = false;
  @Input() bookmarked? = false;
  @Input() showActions? = false;
  @Input() editVisible? = true;
  @Input() deleteVisible? = true;
  @Input() leaveVisible? = true;
  @Input() toggleInitiatiorVisible? = false;
  @Input() isInitiator? = false;
  @Input() narrow? = false;
  @Input() clickable? = true;
  @Input() draft? = false;

  @Output() cardClicked = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() leave = new EventEmitter();
  @Output() toggleInitatior = new EventEmitter();

  @ViewChild('contentRef') contentRef?: ElementRef<HTMLDivElement>;

  constructor(public card: CardService, public utils: UtilsService) {}

  openSlide = 'slide1';
  public contentHeight = 0;

  toggleSlide(slide: string): void {
    this.openSlide = slide;
  }

  cardClickHandler(): void {
    this.cardClicked.emit();
  }

  handleToggleInitiator(): void {
    this.toggleInitatior.emit();
  }

  leaveOrgaHandler(): void {
    this.leave.emit();
  }

  editHandler(): void {
    this.edit.emit();
  }

  deleteHandler(): void {
    this.delete.emit();
  }

  showAsExpired(entity?: Organisation | Activity, type = ''): boolean {
    return this.card.isActivity(type) || (this.card.isDan(type) && entity)
      ? this.utils.isExpiredActivity(this.utils.asActivity(entity).period)
      : false;
  }

  ngAfterViewChecked(): void {
    this.contentHeight = this.contentRef?.nativeElement.offsetHeight || 0;
  }
}
