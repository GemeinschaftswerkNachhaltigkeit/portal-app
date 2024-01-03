import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Type } from '../../data/search.service';
import { TypeTabComponent } from '../type-tab/type-tab.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-type-filter',
  standalone: true,
  imports: [CommonModule, TypeTabComponent, TranslateModule],
  templateUrl: './type-filter.component.html',
  styleUrl: './type-filter.component.scss'
})
export class TypeFilterComponent {
  @Input() activeType: Type;
  @Output() change = new EventEmitter<Type>();

  types: Type[] = ['orga', 'event', 'marketplace'];

  setType(type: Type): void {
    this.change.emit(type);
  }
}
