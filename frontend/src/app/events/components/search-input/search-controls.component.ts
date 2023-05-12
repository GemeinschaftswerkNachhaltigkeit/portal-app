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

export type SearchFields = {
  query: string;
  location: string;
};

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

  @Output() search = new EventEmitter<SearchFields>();

  unsubscribe$ = new Subject();

  formGroup = new FormGroup({
    query: new FormControl<string>(''),
    location: new FormControl<string>('')
  });

  handleClear(): void {
    this.search.emit({ query: '', location: '' });
  }

  handleSubmit(): void {
    const values = this.formGroup.value;
    this.search.emit({
      query: values.query || '',
      location: values.location || ''
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
