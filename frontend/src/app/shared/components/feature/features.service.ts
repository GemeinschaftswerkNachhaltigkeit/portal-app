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

  public async getFeatures() {
    try {
      const response = await this.directusService.directus
        .items('features')
        .readByQuery({});
      if (response?.data && response?.data.length) {
        this.features.next(response?.data as Feature[]);
      }
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }
}
