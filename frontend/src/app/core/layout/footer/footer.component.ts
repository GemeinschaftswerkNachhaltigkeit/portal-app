import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  copyrightYear = new Date().getFullYear();
  participationDeclarationUrl = '';

  constructor(
    public lpService: LandingpageService,
    private translate: TranslateService
  ) {
    this.loadParticipationDeclarationUrl();
    translate.onLangChange.pipe(takeUntilDestroyed()).subscribe(() => {
      this.loadParticipationDeclarationUrl();
    });
  }

  private async loadParticipationDeclarationUrl(): Promise<void> {
    this.participationDeclarationUrl =
      await this.lpService.getParticipationDeclarationUrl();
  }
}
