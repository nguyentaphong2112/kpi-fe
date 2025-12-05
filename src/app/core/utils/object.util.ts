import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { TranslateService } from '@ngx-translate/core';
import { IHbtOption } from '../models/IOption';

// <ng-template #reviewStatusTpl let-reviewStatusId="reviewStatusId">
// <nz-tag
//   [nzColor]="salaryStatusDict[reviewStatusId].backgroud"
//   [ngStyle]="{ color: statusDict[reviewStatusId].color }"
//   >
//   {{ statusDict[reviewStatusId].label | translate}}
// </nz-tag>
// </ng-template>

export class ObjectUtil {
  static optionsToDict(options: IHbtOption<number | string>[]) {
    const dict: { [key: string]: IHbtOption<number | string> } = {};
    options.forEach((o) => {
      dict[o.value] = o;
    });
    return dict;
  }

  static optionsToList(options: IHbtOption<number | string | boolean>[], translate?: TranslateService) {
    options.forEach((o) => {
      if (translate) {
        o.label = translate.instant(o.label);
      }
    });
    return options;
  }

  static optionsToDictLabel(options: IHbtOption<number | string>[]) {
    const dict: { [key: string]: string } = {};
    options.forEach((o) => (dict[o.value] = o.label));
    return dict;
  }

  static optionsToDictColor(options: IHbtOption<number | string>[]) {
    const dict: { [key: string]: string } = {};
    options.forEach((o: NzSafeAny) => (dict[o.value] = o.color));
    return dict;
  }
}
