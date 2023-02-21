import { Component } from '@angular/core';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  copyrightYear = new Date().getFullYear();
  participationDeclarationUrl = '';

  constructor(public lpService: LandingpageService) {
    this.loadParticipationDeclarationUrl();
  }

  private async loadParticipationDeclarationUrl(): Promise<void> {
    this.participationDeclarationUrl =
      await this.lpService.getParticipationDeclarationUrl();
  }
}
