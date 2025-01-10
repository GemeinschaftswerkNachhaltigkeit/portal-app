import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appMenuItem]'
})
export class MenuItemDirective {
  public itemTemplate: TemplateRef<HTMLAnchorElement>;

  constructor(private templateRef: TemplateRef<HTMLAnchorElement>) {
    this.itemTemplate = this.templateRef;
  }
}
