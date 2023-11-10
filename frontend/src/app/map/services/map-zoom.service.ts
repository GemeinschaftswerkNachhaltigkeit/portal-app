import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ActivityType } from 'src/app/shared/models/activity-type';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';

@Injectable({
  providedIn: 'root'
})
export class MapZoomService {
  public defaultZoom = 6;
  private resetZoomTrigger = new Subject();

  constructor() {}

  get mapZoomResetted() {
    return this.resetZoomTrigger.asObservable();
  }

  resetMapZoom() {
    this.resetZoomTrigger.next(null);
  }
}
