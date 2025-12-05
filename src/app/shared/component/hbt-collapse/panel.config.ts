import { ComponentType } from '@angular/cdk/overlay';
import { TemplateRef, Type } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ComponentPortal } from '@angular/cdk/portal';

export class PanelOption {
  id: string;
  active: boolean;
  disabled: boolean;
  code?: string;
  name: string;
  icon?: string;
  panelComponent?: ComponentType<NzSafeAny>;
  panelComponentPortal?: ComponentPortal<NzSafeAny>;
  instance?: any;
  extraMode?: PanelExtraOption[];
  data?: any;
  dataValid?: any;
  componentRef: any;
}

export class PanelExtraOption {
  type: string;
  content?: string | TemplateRef<NzSafeAny> | Type<NzSafeAny>;
  contentHeader?: string;
}

