export class ExtendFieldModel {
  code: string;
  inputType?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  dataSourceType?: string;
  dataSourceValue?: string;
  dataSource?: DataSource[] = [];
  minValue?: number;
  maxValue?: number;
  moduleName?: string[];
  keyValue?: string;
  keyLabel?: string;
  valueIsNumber?: boolean;
}
export class DataSource {
  value: 'number' | 'string';
  label: string;
}
