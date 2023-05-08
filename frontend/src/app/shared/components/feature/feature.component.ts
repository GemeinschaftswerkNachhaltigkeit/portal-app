import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeatureService } from './feature.service';

export type Features = 'menu' | 'dan-account' | 'dan-range';

@Component({
  selector: 'app-feature',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="featureService.features$ | async as features">
      <ng-container *ngIf="featureService.show(features, feature)">
        <ng-content></ng-content>
      </ng-container>
    </ng-container>
  `
})
export class FeatureComponent {
  @Input() feature!: Features;

  constructor(public featureService: FeatureService) {}
}
