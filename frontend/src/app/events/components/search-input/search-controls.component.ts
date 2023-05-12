/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search-controls',
  templateUrl: './search-controls.component.html',
  styleUrls: ['./search-controls.component.scss']
})
export class SearchControlsComponent implements OnDestroy {
  @Input() placeholder = '';
  @Input() withButton = true;
  @Input() buttonText = '';
  @Input() value = '';

  @Output() search = new EventEmitter<string>();
  @Output() searchValueChanged = new EventEmitter<{
    query: string | null;
    location: string | null;
  }>();

  unsubscribe$ = new Subject();

  formGroup = new FormGroup({
    query: new FormControl<string>(''),
    location: new FormControl<string>('')
  });

  handleClear(): void {
    this.searchValueChanged.emit();
    this.search.emit('');
  }

  handleSubmit(): void {
    this.search.emit(this.value);
  }

  handleChange(): void {
    const values = this.formGroup.value;
    this.searchValueChanged.emit({
      query: values.query || '',
      location: values.location || ''
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
