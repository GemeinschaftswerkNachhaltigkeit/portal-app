import {
  AfterContentInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  QueryList
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { TabComponent } from './tab.component';

export type TabButton = {
  key: number;
  title: string;
};

@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .tab-content-wrapper {
        width: 100%;
        position: relative;
      }
    `
  ],
  template: `
    <div class="tabs">
      <div class="tab-buttons">
        <app-tab-buttons>
          <ng-container *ngFor="let button of buttons">
            <app-tab-button
              [active]="button.key === selectedTab"
              (clicked)="handleTabChange(button.key)"
              >{{ button.title }}</app-tab-button
            >
          </ng-container>
        </app-tab-buttons>
      </div>
      <ng-container>
        <div
          class="tab-content-wrapper"
          *ngFor="let el of content; let i = index"
        >
          <div *ngIf="i === selectedTab">
            <ng-container *ngTemplateOutlet="el.template"></ng-container>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class TabsComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(TabComponent) content: QueryList<TabComponent> =
    new QueryList();

  buttons: TabButton[] = [];
  selectedTab = 0;
  unsubscribe$ = new Subject();

  constructor(private cdr: ChangeDetectorRef) {}

  handleTabChange(key: number): void {
    this.selectedTab = key;
  }

  private createButtons(content: QueryList<TabComponent>): TabButton[] {
    return content.map((c, index) => {
      return {
        key: index,
        title: c.title
      };
    });
  }

  ngAfterContentInit(): void {
    this.buttons = this.createButtons(this.content);
    this.content.changes.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.buttons = this.createButtons(this.content);
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
