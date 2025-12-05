import { ICorrector } from '@app/core-update/class/base/correctors';
import { AsyncValidator, ValidationErrors, Validators } from '@angular/forms';
import { BaseService } from '@core/services/base/base.service';
import { FormState } from '@app/core-update/class/constants';

export class CrudFormData {
  data?: any = {};
  submitting ? = false;
  /**
   * Trạng thái của form đang được mở: Là form thêm mới, hay form sửa, hay form xóa
   */
  formState?: FormState = FormState.ADD;

  constructor(init?: CrudFormData) {
    for (const key in init) {
      this[key] = init[key];
    }
  }
}

export class CrudFormSetting {
  disableCaching = false;
  disableDefaultSettingCache = false;
  schema?: FormSchemaBase[] = [];
  baseService?: BaseService;
  buildInSchema?: FormControlBase[] = [];
  uniqueField?: string[] | string[][] = [];
  // fieldDropdown?: { [key: string]: DropdownControlSchema; } = {};
  fieldNeedGetRef?: { [key: string]: TextControlSchema; } = {};
  displayField?: string | ((item) => string);
  firstFocusControl?: string;
  // filterCheckExistByVersion?: Filter[];
  // defaultFilterCheckExist?: Filter[] | (() => Filter[]);
  entityMetadataData?: CrudFormData;
  entityMetadataSetting?: CrudFormSetting;
  validators?: Validators[] = [];
  asyncValidators?: AsyncValidator[] = [];
  // function?: CrudFormCustomFunction = new CrudFormCustomFunction();

  constructor(init?: CrudFormSetting) {
    for (const key in init) {
      this[key] = init[key];
    }
  }
}

export class SchemaBase {
  field?: string;
  fieldFilter?: string;
  uniqueField?: string;
  type?: 'boolean' | 'int' | 'decimal' | 'datetime' | 'string' = 'string';

  constructor(init?: SchemaBase) {
    for (const key in init) {
      this[key] = init[key];
    }
  }
}

export class FormSchemaBase extends SchemaBase {
  label?: string;
  fullLabel?: string;
  description?: string;
  message?: string;
  messageClass?: string;
  showLabel ? = true;
  xsWidth ? = 24;
  mdWidth ? = 12;
  xlWidth ? = 8;
  xxlWidth ? = 6;
  rowSpan ? = 1;
  width?: string;
  class ? = '';
  style?: any = {};
  disabled?: boolean;
  hidden ? = false;
  // hiddenCheck?: (rootModel: any, currentNode: ControlTreeNode) => boolean;
  hiddenOnView ? = false;
  visibleInList ? = true;
  // operator?: Operator;
  groupCode ? = '';
  defaultValue?: any;
  fieldAlias ? = '';
  data?: any = {};

  constructor(init?: FormSchemaBase) {
    super();
    for (const key in init) {
      this[key] = init[key];
    }
  }
}

export class FormControlBase extends FormSchemaBase {
  _component?: any; // Component của schema khi khởi tạo
  uniqueField?: string; // Sử dụng trong table schema
  autofocus ? = false;
  validators?: ValidationErrors[] = [];
  correctors?: ICorrector[] = [];
  required ? = false;
  enableCaching ? = false;
  onChanged?: Function;
  onInit?: Function;
  onRowNodeFinishInit?: Function;
  triggerLoadChild?: Function;
  hasOperatorCanBo ? = false;

  constructor(init?: FormControlBase) {
    super();
    for (const key in init) {
      this[key] = init[key];
    }
  }
}


export class TextControlSchema extends FormControlBase {
  placeholder ? = '';
  dataFormat?: 'text' | 'password' | 'number' | 'email' | 'phone' | 'fax' | 'money' | 'moneyint' | 'amount' = 'text';
  maxLength?: number;
  min ? = 0;
  max ? = Number.MAX_SAFE_INTEGER;

  constructor(init?: TextControlSchema) {
    super();
    for (const key in init) {
      this[key] = init[key];
    }
  }
}

export class SelectControlSchema extends FormControlBase {
  placeholder ? = '';
  dataFormat?: 'text' | 'password' | 'number' | 'email' | 'phone' | 'fax' | 'money' | 'moneyint' | 'amount' = 'text';
  maxLength?: number;
  min ? = 0;
  max ? = Number.MAX_SAFE_INTEGER;

  baseService?: BaseService;
  valueField ? = 'id';
  displayField ? = 'ten';

  plusUrl?: string;
  // sorts?: Sort[] = [];
  sortField ? = '';
  sortDir?: 1 | -1 = 1;
  fieldPlus ? = ''; // Danh sách những trường bổ sung cần lấy thêm ngoài id, ten; Ví dụ ,ma

  constructor(init?: SelectControlSchema) {
    super();
    for (const key in init) {
      this[key] = init[key];
    }
  }
}
