import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss']
})
export class ContentWrapperComponent implements OnInit {
  @Input() narrow = false;
  @Input() onlyX = false;
  @Input() mobileNoMargin = false;
  @Input() size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  wrapperClasses = 'full';

  ngOnInit(): void {
    this.wrapperClasses = `content-wrapper ${this.size || 'full'}`;
  }
}
