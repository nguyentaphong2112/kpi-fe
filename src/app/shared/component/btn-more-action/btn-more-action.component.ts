import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActionSchema } from '@core/models/action.model';

@Component({
  selector: 'btn-more-action',
  templateUrl: './btn-more-action.component.html',
  styleUrls: ['./btn-more-action.component.scss']
})
export class BtnMoreActionComponent implements OnChanges {
  _model: Record<string, any>;
  @Input() setting: ActionSchema;
  @Input() isBtn = false;
  @Input() isExport = false;
  @Input() width = '150px';
  @Input() set model(value: Record<string, any>[]) {
    this._model = value?.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        acc[key] = item[key];
      });
      return acc;
    }, {});
  }

  disabledAll = false;

  ngOnChanges(changes: SimpleChanges) {
    this.disabledAll = this.checkDisableAll();
  }

  checkDisable(disabled: Function): boolean {
    if (disabled && this._model) {
      return disabled(this._model);
    }
    return false;
  }

  checkDisableAll() {
    return !this.setting.arrAction.some(el => !this.checkDisable(el.disabled));
  }
}
