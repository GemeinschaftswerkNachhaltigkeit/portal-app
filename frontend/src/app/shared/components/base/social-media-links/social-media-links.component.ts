import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialMediaContact } from 'src/app/shared/models/social-media-contact';

@Component({
  selector: 'app-social-media-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-media-links.component.html',
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    .social-media-links {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: $spacing-4;
      color: inherit;

      .social-media-link {
        color: inherit;
        width: 24px;
        height: 24px;

        .svg-icon {
          width: 100%;
          height: 100%;
        }
      }
    }
  `
})
export class SocialMediaLinksComponent {
  @Input() socialMediaLinks: SocialMediaContact[] = [];
}
