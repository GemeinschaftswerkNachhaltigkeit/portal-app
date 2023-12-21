import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchHeaderComponent } from '../components/search-header/search-header.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchHeaderComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchValue = signal('');

  handleSearch(searchValue: string): void {
    this.searchValue.set(searchValue);
  }
}
