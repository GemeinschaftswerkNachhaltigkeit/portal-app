/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DirectusService } from 'src/app/shared/services/directus.service';

export type Feature = {
  feature: string;
  active: boolean;
  start?: string;
  end?: string;
};

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {
  features = new BehaviorSubject<Feature[]>([]);
  features$ = this.features.asObservable();

  constructor(private directusService: DirectusService) {
    this.getFeatures();
  }

  getFeature(featureKey: string): Feature | undefined {
    return this.features.value.find((f) => f.feature === featureKey);
  }

  public async getFeatures() {
    try {
      const features =
        await this.directusService.getContentItems<Feature>('features');
      if (features && features.length) {
        this.features.next(features);
      }
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }
}
