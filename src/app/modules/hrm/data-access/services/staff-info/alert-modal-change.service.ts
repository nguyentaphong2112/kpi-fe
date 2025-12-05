import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertModalChangeService {

  private _closePersonalInfo$ = new Subject();
  private _closeStaffInfo$ = new Subject();
  private _saveAvatar$ = new Subject();
  private _closeOrg$ = new Subject();

  public closePersonalInfo$ = this._closePersonalInfo$.asObservable();
  public closeStaffInfo$ = this._closeStaffInfo$.asObservable();
  public saveAvatar$ = this._saveAvatar$.asObservable();
  public closeOrg$ = this._closeOrg$.asObservable();


  closePersonalInfo() {
    this._closePersonalInfo$.next(true);
  }

  closeStaffInfo() {
    this._closeStaffInfo$.next(true);
  }

  saveAvatar(data: any) {
    this._saveAvatar$.next(data);
  }

  closeOrg() {
    this._closeOrg$.next(true);
  }

}
