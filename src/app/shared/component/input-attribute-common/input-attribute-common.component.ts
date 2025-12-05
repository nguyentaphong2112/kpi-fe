import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { DataService } from '@shared/services/data.service';
import { Subscription } from 'rxjs';
import { environment } from '@env/environment';

@Component({
  selector: 'input-attribute-common',
  templateUrl: './input-attribute-common.component.html',
  styleUrls: ['./input-attribute-common.component.scss']
})
export class InputAttributeCommonComponent implements OnInit {
  @Input() dataType: 'DATE' | 'STRING' | 'TEXT' | 'LONG' | 'DOUBLE' | 'LIST' | 'MULTI_LIST' = 'STRING';
  @Input() controlName: FormControl;
  @Input() type: 'default' | 'warning' | 'error' | 'success';
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Input() showError = false;
  @Input() errors: any;
  @Input() placeholderText: string;
  @Input() labelText: string;
  @Input() urlLoadData: string;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  changeValue(value) {
    this.valueChange.emit(value);
  }


}
