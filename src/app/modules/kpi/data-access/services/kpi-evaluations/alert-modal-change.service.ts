import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertModalChangeService {
  private _saveValueGV$: number | null = null;
  private _saveValueHC$: number | null = null;
  private _saveValue$ = new Subject();

  public saveValue$ = this._saveValue$.asObservable();


  saveValueGV(data: any) {
    this._saveValueGV$ = parseFloat(data);
    this.saveValue();
  }

  saveValueHC(data: any) {
    this._saveValueHC$ = parseFloat(data);
    this.saveValue();
  }


  resetData() {
    this._saveValueGV$ = null;
    this._saveValueHC$ = null;
  }

  saveValue() {
    this._saveValue$.next((!isNaN(this._saveValueGV$) ? this._saveValueGV$ : 0) + (!isNaN(this._saveValueHC$) ? this._saveValueHC$ : 0));
  }


}
