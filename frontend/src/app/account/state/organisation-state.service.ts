import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Organisation from 'src/app/shared/models/organisation';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import UserListDto from '../models/user-list-dto';

@Injectable({
  providedIn: 'root'
})
export class OrganisationStateService {
  private organisation = new BehaviorSubject<Organisation | null>(null);
  private users = new BehaviorSubject<UserListDto[]>([]);

  get organisation$(): Observable<Organisation | null> {
    return this.organisation.asObservable();
  }

  get users$(): Observable<UserListDto[]> {
    return this.users.asObservable();
  }

  setOrganisation(orga: Organisation | OrganisationWIP | null): void {
    this.organisation.next(orga as Organisation);
  }

  setUsers(users: UserListDto[]): void {
    this.users.next(users);
  }
}
