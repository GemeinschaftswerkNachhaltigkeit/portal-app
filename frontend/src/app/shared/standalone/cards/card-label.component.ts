import { Component, Input } from '@angular/core';
import { CardService } from '../../../map/services/card.service';
import { CommonModule } from '@angular/common';
import { LabelComponent } from '../base/label.component';

@Component({
  selector: 'app-card-label',
  standalone: true,
  imports: [CommonModule, LabelComponent],
  template: `
    <ng-container *ngIf="(activityTypeLabel || organisationTypeLabel) && type">
      <ng-container *ngIf="!card.isOrga(type) && activityTypeLabel">
        <app-label
          [color]="dan ? 'blue' : 'green'"
          [limitedWidth]="limitedWidth"
        >
          {{ activityTypeLabel }}
        </app-label>
      </ng-container>
      <ng-container *ngIf="card.isOrga(type) && organisationTypeLabel">
        <app-label color="orange" [limitedWidth]="limitedWidth">
          {{ organisationTypeLabel }}
        </app-label>
      </ng-container>
    </ng-container>
  `,
  styles: `
    :host {
      font-size: 1.2rem;
    }
  `
})
export class CardLabelComponent {
  @Input() type?: string;
  @Input() organisationTypeLabel? = '';
  @Input() activityTypeLabel? = '';
  @Input() limitedWidth? = false;
  @Input() dan? = false;

  constructor(public card: CardService) {}
}
