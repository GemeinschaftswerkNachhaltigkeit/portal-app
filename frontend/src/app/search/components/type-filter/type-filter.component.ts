import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Type } from '../../data/search.service';
import { TypeTabComponent } from '../type-tab/type-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { DirectusContentService } from 'src/app/shared/services/directus-content.service';

@Component({
  selector: 'app-type-filter',
  standalone: true,
  imports: [CommonModule, TypeTabComponent, TranslateModule],
  templateUrl: './type-filter.component.html',
  styleUrl: './type-filter.component.scss'
})
export class TypeFilterComponent {
  @Input() activeType: Type;
  @Output() typeChange = new EventEmitter<Type>();

  private contentService = inject(DirectusContentService);

  types: Type[] = ['orga', 'event', 'marketplace'];
  searchConent = this.contentService.searchContent;

  constructor() {
    this.contentService.getSearchTranslations();
  }

  setType(type: Type): void {
    this.typeChange.emit(type);
  }

  getTabInfo(type: string): string {
    if (type === 'orga') {
      return this.searchConent()?.organisation_info_text || '';
    }
    if (type === 'event') {
      return this.searchConent()?.event_info_text || '';
    }
    if (type === 'marketplace') {
      return this.searchConent()?.markteplace_info_text || '';
    }
    return '';
  }
}
