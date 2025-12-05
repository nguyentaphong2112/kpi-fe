import {Pipe, PipeTransform} from '@angular/core';
import {PanelOption} from '@app/shared/component/hbt-collapse/panel.config';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Pipe({
  name: 'checkExtraMode'
})
export class CheckExtraMode implements PipeTransform {

  transform(type: string, panel: PanelOption | NzSafeAny, ): boolean {
    const extraMode = panel.extraMode?.find((mode: NzSafeAny) => mode.type === type);
    let isOk = false;
    if (extraMode) {
      isOk = true;
    }
    return isOk;
  }

}
