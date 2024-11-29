/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable, computed, signal } from '@angular/core';
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
  featuresState = signal<'OK' | 'ERROR' | 'PENDING'>('PENDING');
  featuresLoaded = computed(() =>
    ['OK', 'ERROR'].includes(this.featuresState())
  );
  ready: Promise<void>;

  constructor(private directusService: DirectusService) {
    this.ready = this.getFeatures();
  }

  getFeature(featureKey: string): Feature | undefined {
    return this.features.value.find((f) => f.feature === featureKey);
  }

  public async getFeatures() {
    try {
      const features =
        await this.directusService.getContentItems<Feature>('features');
      if (features && features.length) {
        this.featuresState.set('OK');
        this.features.next(features);
      }
    } catch (e) {
      this.featuresState.set('ERROR');
      console.error('loadError', e);
      return;
    }
  }
}
