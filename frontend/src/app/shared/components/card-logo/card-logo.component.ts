import { Component, Input } from '@angular/core';
import { ImgService } from 'src/app/shared/services/img.service';

@Component({
  selector: 'app-card-logo',
  templateUrl: './card-logo.component.html',
  styleUrls: ['./card-logo.component.scss']
})
export class CardLogoComponent {
  @Input() name? = '';
  @Input() logoUrl? = '';
  @Input() noBorder? = false;

  constructor(private imgService: ImgService) {}

  get logo(): string | null {
    return this.imgService.url(this.logoUrl);
  }
}
