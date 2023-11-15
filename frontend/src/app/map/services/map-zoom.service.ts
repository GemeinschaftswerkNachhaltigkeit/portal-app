import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
