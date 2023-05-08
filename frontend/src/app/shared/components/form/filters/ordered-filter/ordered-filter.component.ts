import { Component, Input, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-ordered-filter',
  templateUrl: './ordered-filter.component.html',
  styleUrls: ['./ordered-filter.component.scss']
})
export class OrderedFilterComponent implements OnInit {
  @Input() orderNumber = 0;
  @HostBinding('style') style = '';

  ngOnInit(): void {
    this.style = `order: ${this.orderNumber}`;
  }
}
