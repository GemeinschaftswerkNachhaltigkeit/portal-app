import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PartnerLink } from '../models/partner-link';

@Injectable({
  providedIn: 'root'
})
export class PartnerLinksStateService {
  private parnterLinks = new BehaviorSubject<PartnerLink[]>([]);

  get parnterLinks$(): Observable<PartnerLink[]> {
    return this.parnterLinks.asObservable();
  }

  setPartnerLinks(links: PartnerLink[]): void {
    this.parnterLinks.next(links);
  }
}
