import { Component, OnInit } from '@angular/core';
import { DeveloperFacadeService } from 'src/app/account/developer-facade.service';

@Component({
  selector: 'app-api-key',
  templateUrl: './api-key.component.html',
  styleUrls: ['./api-key.component.scss']
})
export class ApiKeyComponent implements OnInit {
  apiKey$ = this.developerFacade.apiKey$;

  constructor(private developerFacade: DeveloperFacadeService) {}

  createHandler(): void {
    this.developerFacade.createApiKey();
  }

  deleteHandler(): void {
    this.developerFacade.deleteApiKey();
  }

  ngOnInit(): void {
    this.developerFacade.loadApiKey();
  }
}
