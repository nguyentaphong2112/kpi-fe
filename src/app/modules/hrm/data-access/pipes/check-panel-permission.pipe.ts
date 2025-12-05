import { Pipe, PipeTransform } from '@angular/core';
import { AppFunction } from '@app/core/models/app-function.interface';
import { SessionService } from '@app/core/services/session.service';
import { PanelOption } from '@app/shared/component/hbt-collapse/panel.config';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Constant } from '../constant/constant.class';

@Pipe({
  name: 'checkPanelPermission'
})
export class CheckPanelPermission implements PipeTransform {

  constructor(private sessionService: SessionService) {
  }

  transform(type: string, panel: PanelOption | NzSafeAny): boolean {
    const objFunction: AppFunction = this.sessionService.getSessionData(`FUNCTION_${panel.code}`);
    let isPermissive = false;
    switch (type) {
      case Constant.ACTION_PANEL.VIEW:
      case Constant.ACTION_PANEL.SEARCH:
        if (objFunction?.view) {
          isPermissive = true;
        }
        break;
      case Constant.ACTION_PANEL.EDIT:
        if (objFunction?.edit) {
          isPermissive = true;
        }
        break;
      case Constant.ACTION_PANEL.ADD:
        if (objFunction?.create) {
          isPermissive = true;
        }
        break;
      default:
        isPermissive = false;
    }

    return isPermissive;
  }

}
