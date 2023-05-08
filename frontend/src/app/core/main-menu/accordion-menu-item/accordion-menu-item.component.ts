import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { CdkAccordionItem } from '@angular/cdk/accordion';

@Component({
  selector: 'app-accordion-menu-item',
  templateUrl: './accordion-menu-item.component.html',
  styleUrls: ['./accordion-menu-item.component.scss'],
  animations: [
    trigger('bodyExpansion', [
      state('false', style({ height: '0px', visibility: 'hidden' })),
      state('true', style({ height: '*', visibility: 'visible' })),
      transition('true <=> false', animate('300ms ease-in-out'))
    ]),
    trigger('indicatorRotate', [
      state('false', style({ transform: 'rotate(0deg)' })),
      state('true', style({ transform: 'rotate(180deg)' })),
      transition('true <=> false', animate('300ms ease-in-out'))
    ])
  ]
})
export class AccordionMenuItemComponent extends CdkAccordionItem {
  @Input() title = '';
  @Input() new = false;
}
