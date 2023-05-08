import { Injectable } from '@angular/core';
import Activity from 'src/app/shared/models/actvitiy';
import { ActiFacadeService } from '../acti-facade.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityUtilsService {
  constructor(public actiFacade: ActiFacadeService) {}

  hasOrga(): boolean {
    return this.actiFacade.hasFinishedOrga();
  }

  hasInvalidLocations(activities: Activity[]): boolean {
    return activities.reduce((prev: boolean, current: Activity) => {
      if (
        !current.location?.online &&
        !current.location?.privateLocation &&
        !current.location?.coordinate
      ) {
        return true;
      }
      return prev;
    }, false);
  }

  noLocation(activity: Activity): boolean {
    return (
      !activity.location?.online &&
      !activity.location?.privateLocation &&
      !activity.location?.coordinate
    );
  }
}
