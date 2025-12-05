import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  spinner = new BehaviorSubject<string>('');
  count = 0;

  constructor() {
  }

  getSpinnerObserver(): Observable<string> {
    return this.spinner.asObservable();
  }

  requestStart() {
    if (++this.count === 1) {
      this.spinner.next('start');
    }
  }

  requestEnd() {
    if (this.count === 0 || --this.count === 0) {
      this.spinner.next('stop');
    }
  }
}
