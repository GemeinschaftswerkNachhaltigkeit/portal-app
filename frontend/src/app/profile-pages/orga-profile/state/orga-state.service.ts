import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Organisation from '../../../shared/models/organisation';

@Injectable({
  providedIn: 'root'
})
export class OrgaStateService {
  organisation = new BehaviorSubject<Organisation | null>(null);

  get orga$(): Observable<Organisation | null> {
    return this.organisation.asObservable();
  }

  get orga(): Organisation | null {
    return this.organisation.value;
  }

  setOrga(orga: Organisation | null): void {
    this.organisation.next(orga);
  }
}
