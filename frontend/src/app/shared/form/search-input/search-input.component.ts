/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {
  @Input() placeholder = '';
  @Input() withButton = true;
  @Input() buttonText = '';
  @Input() value = '';

  @Output() search = new EventEmitter<string>();
  @Output() searchValueChanged = new EventEmitter<string>();

  handleClear(): void {
    this.searchValueChanged.emit('');
    this.search.emit('');
  }

  handleSubmit(): void {
    this.search.emit(this.value);
  }

  handleChange($event: any): void {
    this.searchValueChanged.emit($event.target.value);
  }
}
