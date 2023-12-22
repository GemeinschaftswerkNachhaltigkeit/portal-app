import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedModule
  ],
  templateUrl: './search-header.component.html',
  styleUrl: './search-header.component.scss'
})
export class SearchHeaderComponent implements OnChanges {
  @Input() searchValue = '';
  @Output() search = new EventEmitter<string>();

  formGroup = new FormGroup({
    search: new FormControl<string>(this.searchValue)
  });

  handleSearch(event: SubmitEvent) {
    this.search.emit(this.formGroup.get('search')?.value || '');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formGroup.get('search')?.setValue(this.searchValue);
  }
}
