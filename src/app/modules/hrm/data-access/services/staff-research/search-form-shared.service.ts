import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchFormSharedService {

  private searchFormValue = new BehaviorSubject<any>(null);

  setSearchForm(state: any) {
    this.searchFormValue.next(state);
  }

  getSearchForm() {
    return this.searchFormValue.asObservable();
  }
}
