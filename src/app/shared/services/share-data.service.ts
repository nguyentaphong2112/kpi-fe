import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PersonalInfo } from '../model/personal-info';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  private personalInfoSource = new Subject<PersonalInfo>();
  personalInfo$ = this.personalInfoSource.asObservable();

  changePersonalInfo(personalInfo: PersonalInfo) {
    this.personalInfoSource.next(personalInfo);
  }

  private employee = new BehaviorSubject<{ employeeId: number | any }>({ employeeId: null });
  public employee$ = this.employee.asObservable();

  changeEmployee(employee: { employeeId: number }) {
    this.employee.next(employee);
  }

  private emitChangeSource = new Subject<boolean>();
  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange(change: boolean) {
    this.emitChangeSource.next(change);
  }

}
