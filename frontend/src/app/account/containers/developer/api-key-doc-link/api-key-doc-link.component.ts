import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-api-key-doc-link',
  templateUrl: './api-key-doc-link.component.html',
  styleUrls: ['./api-key-doc-link.component.scss']
})
export class ApiKeyDocLinkComponent {
  @Input() url = '';

  contextPath = environment.contextPath;
}
