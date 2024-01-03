import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DirectusService } from 'src/app/shared/services/directus.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

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
export class SearchHeaderComponent implements OnChanges, OnInit, OnDestroy {
  @Input() searchValue = '';
  @Output() search = new EventEmitter<string>();

  unsubscribe$ = new Subject();
  cms = inject(DirectusService);
  translate = inject(TranslateService);

  content = signal<{
    image?: string;
    title_line_1?: string;
    title_line_2?: string;
    content?: string;
  }>({});

  constructor() {}

  formGroup = new FormGroup({
    search: new FormControl<string>(this.searchValue)
  });

  handleSearch(event: SubmitEvent) {
    console.log('HANDLE');
    this.search.emit(this.formGroup.get('search')?.value || '');
  }

  async getContent() {
    const content = await this.cms.getContentItem<{ image: string }>('search');
    const image = (content && this.cms.getFileUrl(content.image)) || '';
    const translations =
      (await this.cms.getContentItemForCurrentLang<{
        title_line_1: string;
        title_line_2: string;
        content: string;
      }>('search_translations')) || {};
    this.content.set({
      image,
      ...translations
    });
  }

  ngOnInit(): void {
    this.getContent();
    this.translate.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getContent();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formGroup.get('search')?.setValue(this.searchValue);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next({});
    this.unsubscribe$.complete();
  }
}
