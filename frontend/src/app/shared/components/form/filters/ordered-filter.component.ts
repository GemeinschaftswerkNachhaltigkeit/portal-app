import { Component, Input, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-ordered-filter',
  standalone: true,
  imports: [],
  template: ` <ng-content></ng-content> `
})
export class OrderedFilterComponent implements OnInit {
  @Input() orderNumber = 0;
  @HostBinding('style') style = '';

  ngOnInit(): void {
    this.style = `order: ${this.orderNumber}`;
  }
}
