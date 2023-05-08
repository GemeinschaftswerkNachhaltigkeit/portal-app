import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Activity from '../../../shared/models/actvitiy';

@Injectable({
  providedIn: 'root'
})
export class ActivityStateService {
  activity = new BehaviorSubject<Activity | null>(null);

  get activity$(): Observable<Activity | null> {
    return this.activity.asObservable();
  }

  get activityData(): Activity | null {
    return this.activity.value;
  }

  setActivity(activity: Activity | null): void {
    this.activity.next(activity);
  }
}
