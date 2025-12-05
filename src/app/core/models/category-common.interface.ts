export interface CategoryModel {
  code?: string;
  name?: string;
  description?: string;
  value?: string | boolean | number;
  orderNum?: string;
  parentCode?: string;
  statusType?: number;
  bgColor?: string;
  color?: string;
  label?: string;
}
