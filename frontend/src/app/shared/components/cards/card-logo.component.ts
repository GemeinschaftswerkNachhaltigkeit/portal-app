import { Component, Input } from '@angular/core';
import { ImgService } from 'src/app/shared/services/img.service';

@Component({
  selector: 'app-card-logo',
  standalone: true,
  imports: [],
  template: `<div class="logo">
    @if (logo) {
      <img
        class="logo-img"
        [src]="logo"
        alt="logo"
        [width]="imageDimensions?.width"
        [height]="imageDimensions?.height"
      />
    }
  </div>`,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    .logo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: white;
      .logo-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .logo-placeholder {
        background-color: $gray-light;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: $gray;
        font-weight: bold;
      }
    }
  `
})
export class CardLogoComponent {
  @Input() name? = '';
  @Input() logoUrl? = '';
  @Input() noBorder? = false;
  @Input() imageDimensions?: {
    width: number;
    height: number;
  };

  constructor(private imgService: ImgService) {}

  get logo(): string | null {
    return this.imgService.url(this.logoUrl);
  }
}
