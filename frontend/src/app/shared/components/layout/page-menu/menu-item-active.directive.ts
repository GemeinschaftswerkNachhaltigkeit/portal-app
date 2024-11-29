import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';

@Directive({
  selector: '[appMenuItemActive]'
})
export class MenuItemActiveDirective implements OnInit {
  @Input() appMenuItemActive = '';
  currentFragment: string | null = null;
  constructor(
    private el: ElementRef,
    private route: ActivatedRoute,
    private utils: UtilsService
  ) {}
  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: string | null) => {
      this.currentFragment = fragment;
      if (this.appMenuItemActive === this.currentFragment) {
        this.el.nativeElement.classList.add('active');
        this.utils.scrollToAnchor(this.appMenuItemActive, 100);
      } else {
        this.el.nativeElement.classList.remove('active');
      }
    });
  }
}
