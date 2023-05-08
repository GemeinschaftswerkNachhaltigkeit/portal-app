import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-modal-button',
  templateUrl: './filter-modal-button.component.html',
  styleUrls: ['./filter-modal-button.component.scss']
})
export class FilterModalButtonComponent {
  @Input() count!: number;
  @Output() clear = new EventEmitter<void>();
  @Output() openModal = new EventEmitter<void>();

  clearAll(): void {
    this.clear.emit();
  }

  openFilters(): void {
    this.openModal.emit();
  }
}
