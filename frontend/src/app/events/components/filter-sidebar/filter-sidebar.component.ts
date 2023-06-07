import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent {
  @Input() permanent = false;
  @Output() permanentChanged = new EventEmitter<boolean>();

  handleTabChange(permanent: boolean): void {
    this.permanentChanged.emit(permanent);
  }
}
