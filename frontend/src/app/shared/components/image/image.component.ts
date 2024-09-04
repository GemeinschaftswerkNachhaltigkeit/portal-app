import { Component, Input } from '@angular/core';
import { ImgService } from '../../services/img.service';
import { ImageMode } from '../form/upload-image/upload-image.component';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
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
