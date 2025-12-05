export interface TreeNode {
  code?: string;
  displayName?: string;
  id?: string;
  indexNumber?: number;
  isMenu?: string;
  name?: string;
  type?: string;
  uri?: string;
  children?: Array<TreeNode>;
  level?: number;
  parent?: TreeNode;
  description?: string;
  dataId?: number;
  dataType?: string;
  key?: string | number;
  permissionType?: string;
  parentId?: string;
  checked?: boolean;
  parentChecked?: boolean;
  originId?: string;
  expand?: boolean,
  expandCustom?: boolean,
  isChecked?: boolean,
  nodeId?: number,
  selected?: boolean;
}
