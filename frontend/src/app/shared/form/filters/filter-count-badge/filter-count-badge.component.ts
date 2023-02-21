import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-count-badge',
  templateUrl: './filter-count-badge.component.html',
  styleUrls: ['./filter-count-badge.component.scss']
})
export class FilterCountBadgeComponent {
  @Input() active? = false;
  @Output() clicked = new EventEmitter();

  deleteHandler(event: MouseEvent): void {
    event?.stopPropagation();
    this.clicked.emit();
  }
}
