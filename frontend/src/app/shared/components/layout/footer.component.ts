import { Component } from '@angular/core';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';
import { ContentWrapperComponent } from './content-wrapper.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ContentWrapperComponent, TranslateModule],
  template: `<footer class="footer">
    <app-content-wrapper>
      <div class="footer-content">
        <div class="copyright">
          <span class="footer__copyright"
            >Gemeinschaftswerk Nachhaltigkeit © {{ copyrightYear }} | All
            rights reserved.</span
          >
        </div>
        <div class="links font-2">
          <a
            href="{{ lpService.getImprintUrl() }}"
            target="_blank"
            rel="noopener"
            >{{ 'footer.imprint' | translate }}</a
          >
          <a
            href="{{ lpService.getPrivacyPolicyUrl() }}"
            target="_blank"
            rel="noopener"
            >{{ 'footer.privacy' | translate }}</a
          >
          <a
            href="{{ participationDeclarationUrl }}"
            target="_blank"
            rel="noopener"
            >{{ 'footer.participation' | translate }}</a
          >
        </div>
      </div>
    </app-content-wrapper>
  </footer> `,
  styles: `
    @use 'theme' as *;
    .footer {
      background-color: #f2f2f2;
      width: 100%;

      .footer-content {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-1;
        flex-direction: row;
        width: 100%;
      }

      .links {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        flex-direction: row;
      }
    }

    @media only screen and (min-width: $breakpoint-xs) {
      .footer-content {
        justify-content: space-between;
      }
    }
  `
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
