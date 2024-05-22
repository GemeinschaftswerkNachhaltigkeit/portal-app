import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { Feature, FeaturesService } from './features.service';

export type FeedbackType = 'success' | 'error';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  features$ = this.features.features$;

  constructor(private features: FeaturesService) {}

  show$(feature?: string): Observable<boolean> {
    return this.features$.pipe(
      map((features) => {
        return this.show(features, feature);
      })
    );
  }

  getFeature(featureKey: string): Feature | undefined {
    return this.features.getFeature(featureKey);
  }

  show(features: Feature[] = [], featureKey?: string): boolean {
    let show = false;
    const feature = features?.find((f) => f.feature === featureKey);

    if (!feature) {
      show = true;
    }

    if (feature && feature.active) {
      show = this.inRange(feature.start, feature.end);
    }
    return show;
  }

  showSync(featureKey?: string): boolean {
    let show = false;
    const features = this.features.features.value;
    const feature = features?.find((f) => f.feature === featureKey);

    if (!feature) {
      show = true;
    }

    if (feature && feature.active) {
      show = this.inRange(feature.start, feature.end);
    }
    return show;
  }

  private inRange(start?: string, end?: string): boolean {
    const currentTime = new Date().getTime();
    let startTime = null;
    let endTime = null;
    if (start) {
      startTime = new Date(start).getTime();
    }
    if (end) {
      endTime = new Date(end).getTime();
    }

    if (startTime && !endTime) {
      return currentTime >= startTime;
    }

    if (endTime && !startTime) {
      return currentTime < endTime;
    }

    if (startTime && endTime) {
      return currentTime >= startTime && currentTime < endTime;
    }
    return true;
  }
}
