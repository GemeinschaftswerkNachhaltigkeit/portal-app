import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageWithHeaderLayoutComponent } from 'src/app/shared/components/layout/page-with-header-layout.component';
import { ApiKeyDocLinksComponent } from './api-key-doc-links/api-key-doc-links.component';
import { ApiKeyDocLinkComponent } from './api-key-doc-link/api-key-doc-link.component';
import { ApiKeyComponent } from './api-key.component';

@Component({
  selector: 'app-developer',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PageWithHeaderLayoutComponent,
    ApiKeyDocLinksComponent,
    ApiKeyDocLinkComponent,
    ApiKeyComponent
  ],
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss']
})
export class DeveloperComponent {
  links = [
    {
      title: 'Swagger UI',
      url: '/swagger-ui.html '
    },
    {
      title: 'Open-Api v3 Spec',
      url: '/v3/api-docs'
    },
    {
      title: 'Github',
      url: 'https://github.com/GemeinschaftswerkNachhaltigkeit',
      absoluteUrl: true
    },
    {
      title: 'Einbindung der Karte',
      url: 'assets/documents/Einbindung_WPGWN_Karte.pdf'
    }
  ];
}
