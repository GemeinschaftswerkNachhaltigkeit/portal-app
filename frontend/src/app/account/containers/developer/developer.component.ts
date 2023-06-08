import { Component } from '@angular/core';

@Component({
  selector: 'app-developer',
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
