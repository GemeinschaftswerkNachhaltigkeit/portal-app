import { Component, Input } from '@angular/core';
import { ImgService } from '../../services/img.service';
import { ImageMode } from '../../components/form/upload-image/upload-image.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  template: `<img
    [src]="getSrc()"
    alt="alt"
    [ngClass]="{
      cover: mode === 'cover' || !mode,
      contain: mode === 'contain'
    }"
  /> `,
  styles: `
    img {
      width: 100%;
      height: 100%;
      object-position: center;
    }

    .cover {
      object-fit: cover;
    }

    .contain {
      object-fit: contain;
    }
  `
})
export class ImageComponent {
  @Input() src!: string;
  @Input() alt = '';
  @Input() mode?: ImageMode = 'cover';

  constructor(private imgService: ImgService) {}

  getSrc(): string | null {
    if (this.src?.startsWith('http')) return this.src;
    return this.imgService.url(this.src);
  }
}
