import { Component, EventEmitter, Output } from '@angular/core';
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
export class SearchHeaderComponent {
  @Output() search = new EventEmitter<string>();

  formGroup = new FormGroup({
    search: new FormControl<string>('')
  });

  handleSearch(event: SubmitEvent) {
    console.log('>>> search', this.formGroup.get('search')?.value);
    this.search.emit(this.formGroup.get('search')?.value || '');
  }
}
