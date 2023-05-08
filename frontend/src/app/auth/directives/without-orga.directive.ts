/*  eslint-disable  @typescript-eslint/no-explicit-any */
import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appWithoutOrga]'
})
export class WithoutOrgaDirective implements OnInit {
  hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.userHasOrga()) {
      this.hasView = true;
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
