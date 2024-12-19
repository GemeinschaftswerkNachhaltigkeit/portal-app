
import { Component, Input } from '@angular/core';
import { SdgsService } from 'src/app/shared/services/sdgs.service';
import { SdgIconComponent } from './sdg-icon.component';

@Component({
  selector: 'app-sdgs-list',
  standalone: true,
  imports: [SdgIconComponent],
  template: `
    @for (goal of sdgs; track goal) {
      <app-sdg-icon [goal]="goal"></app-sdg-icon>
    }
    `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 1.75em;
      justify-content: space-evenly;
    }
  `
})
export class SdgsListComponent {
  @Input() sdgs: number[] = this.sdgsService.allSdgs;

  constructor(private sdgsService: SdgsService) {}
}
