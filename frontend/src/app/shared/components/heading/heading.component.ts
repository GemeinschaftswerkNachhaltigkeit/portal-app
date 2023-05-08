import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent {
  @Input() type: 'h1' | 'h2' | 'h3' | 'h4' = 'h1';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '' = '';
  @Input() color: 'none' | 'yellow' | 'blue' = 'yellow';
  @Input() hoverable = false;
  @Input() uppercase = false;
  @Input() thin = false;
  @Input() active = false;
  @Input() noMobileSize = false;

  options(): { [key: string]: boolean } {
    return {
      uppercase: this.uppercase,
      hoverable: this.hoverable,
      thin: this.thin,
      active: this.active,
      mobileOff: this.noMobileSize
    };
  }

  getClasses(defaultSize: string): string {
    const size = this.size ? this.size : defaultSize;
    const color = this.color ? this.color : 'yellow';
    const classes = size + ' ' + color;
    return classes;
  }
}
