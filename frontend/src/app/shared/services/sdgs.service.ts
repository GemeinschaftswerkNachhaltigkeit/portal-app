import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SdgsService {
  constructor(private translate: TranslateService) {}

  allSdgs = Array.from({ length: 17 }, (_, i) => i + 1);

  getGoalIconPath(goal: number) {
    const currentLang =
      this.translate.currentLang || this.translate.defaultLang;
    const sdgAssetsPath = `${environment.assetsUrl}/img/sdg-icons/`;
    const paddedGoalNumber = goal.toString().padStart(2, '0');
    switch (currentLang) {
      case 'en':
        return `${sdgAssetsPath}${currentLang}/E-WEB-Goal-${paddedGoalNumber}.png`;
      default:
        return `${sdgAssetsPath}${currentLang}/SDG-icon-DE-${paddedGoalNumber}.jpg`;
    }
  }
}
