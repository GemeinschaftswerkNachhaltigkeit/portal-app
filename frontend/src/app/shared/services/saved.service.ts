import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SavedService {
  private static readonly DURATION = 10000;

  private timeout: ReturnType<typeof setTimeout>;
  private savedState = signal(false);

  saved = computed(() => this.savedState());

  showSaved() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.savedState.set(true);
    this.timeout = setTimeout(() => {
      this.savedState.set(false);
    }, SavedService.DURATION);
  }
}
