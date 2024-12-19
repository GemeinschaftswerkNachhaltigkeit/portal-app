
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ContentWrapperComponent } from '../content-wrapper.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  standalone: true,
  imports: [
    ContentWrapperComponent,
    MatButtonModule,
    TranslateModule
]
})
export class NotFoundPageComponent {
  goToLandingpage() {
    location.href = environment.landingPageUrl;
  }
}
