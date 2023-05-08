import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DanHelpModalContent } from '../api/account-content-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountContentStateService {
  private danHelpModal = new BehaviorSubject<DanHelpModalContent | null>(null);

  get danHelpModal$(): Observable<DanHelpModalContent | null> {
    return this.danHelpModal.asObservable();
  }

  setDanHelpModal(content: DanHelpModalContent | null): void {
    this.danHelpModal.next(content);
  }

  clearDanHelpModal(): void {
    this.danHelpModal.next(null);
  }
}
