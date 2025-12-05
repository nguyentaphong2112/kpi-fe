import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import {ValidatorInfo} from "@shared/model/validators";

@Component({
  selector: 'extend-form-item',
  templateUrl: './extend-form-item.component.html',
  styleUrls: ['./extend-form-item.component.scss'],
})
export class ExtendFormItemComponent implements OnChanges {
  @Input() labelText: string | any;
  @Input() @InputBoolean() noLabelText = false;
  @Input() errors: any;
  @Input() errorDefs: ValidatorInfo[] = [];
  @Input() @InputBoolean() showError: boolean = false;

  @Input() @InputBoolean() isRequired = false;

  errorMessage:string = '';
  errorClass: string = '';
  errorIcon: string | undefined;

  classIconDefault = {
    warning: 'warning',
    danger: 'warning',
    success: 'check-circle'
  };

  constructor() {
   }

  ngOnChanges(changes:any):void {
    var errors:any = this.errors;
    this.errorMessage = '';
    this.errorClass = '';
    if (errors) {
      if (!this.setErrorMessage(errors, ['danger', undefined], 'extend-form-item__has-errors')
        && !this.setErrorMessage(errors, ['warning'], 'extend-form-item__has-warning')) {
        this.setErrorMessage(errors, ['success'], 'extend-form-item__has-success')
      }
    }
  }

  setErrorMessage(errors: any, type: any, errorClass?: string) {
    for(let error of this.errorDefs) {
      let key = error.errorName
      if (errors[key] && type.includes(error.type)) {
        this.errorMessage = error.errorDescription;
        if (errorClass) {
          this.errorClass = errorClass;
        }
        this.errorIcon = error.icon ?? this.classIconDefault[error.type ?? 'danger'];
        return true;
      }
    }
    return false;
  }

}
