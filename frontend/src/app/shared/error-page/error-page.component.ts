import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent {
  error: string | undefined;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.error = params['error'];
    });
  }

  goToLandingpage() {
    location.href = environment.landingPageUrl;
  }
}
