import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivityType } from 'src/app/shared/models/activity-type';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private translate: TranslateService) {}

  topics(topics: ThematicFocus[]): string[] {
    return topics.map((t) => this.translate.instant(`thematicFocus.${t}`));
  }

  type(t: ActivityType | null): string {
    return this.translate.instant(`activityType.${t}`);
  }

  isOrga(type = ''): boolean {
    return type === 'ORGANISATION' || type === 'organisation';
  }

  isActivity(type = ''): boolean {
    return type === 'ACTIVITY' || type === 'activity';
  }

  isDan(type = ''): boolean {
    return type === 'DAN';
  }
}
