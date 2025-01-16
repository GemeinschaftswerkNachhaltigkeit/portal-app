import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeatureService } from './feature.service';
import { CommonModule } from '@angular/common';

export type Features = 'menu' | 'dan-account' | 'dan-range';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (featureService.features$ | async; as features) {
      @if (featureService.show(features, feature)) {
        <ng-content></ng-content>
      }
    }
  `
})
export class FeatureComponent {
  @Input() feature!: Features;

  constructor(public featureService: FeatureService) {}
}
