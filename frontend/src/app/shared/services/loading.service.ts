import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loaders = new BehaviorSubject<string[]>([]);

  start(id?: string): string {
    const loaderId = id || uuidv4();
    this.addId(loaderId);
    return loaderId;
  }

  stop(id: string) {
    this.removeId(id);
  }

  isLoading(id?: string): boolean {
    return this.loading(this.loaders.value, id);
  }

  isLoading$(id?: string): Observable<boolean> {
    return this.loaders.asObservable().pipe(
      map((loaders: string[]) => {
        return this.loading(loaders, id);
      })
    );
  }

  private loading(loaders: string[], id?: string): boolean {
    return !id ? loaders.length > 0 : this.hasId(id);
  }

  private hasId(id: string): boolean {
    return !!this.loaders.value.find((existingId) => existingId === id);
  }

  private removeId(id: string): void {
    if (this.hasId(id)) {
      const ids = this.loaders.value;
      const updatedIds = ids.filter((currentId) => currentId !== id);
      this.loaders.next(updatedIds);
    }
  }

  private addId(id: string): void {
    if (!this.hasId(id)) {
      const ids = this.loaders.value;
      this.loaders.next([...ids, id]);
    }
  }
}
