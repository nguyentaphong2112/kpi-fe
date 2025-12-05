export interface AppFunction {
  menuId: number,
  menuCode: string,
  menuName: string,
  parentId: number,
  parent?: AppFunction,
  menuUri: string,
  isMenu?: string,
  scopes: Array<string>,
  subs?: Array<AppFunction>,
  breadCrumbs?: Array<{ url: string, label: string }>,
  view: boolean, //Xem Thông tin
  create: boolean, //Tạo mới
  edit: boolean, //Sửa
  delete: boolean, //Xóa
  approve: boolean; //Phê duyệt - Từ chôi
  import: boolean, //Import
  upload: boolean, //Upload Fil
  download: boolean, //Download File
  adjusted: boolean; //Điều chỉnh
  correction: boolean; //Hiệu chỉnh
  cancel: boolean; //Hủy
  review: boolean; //Xét duyệt
  // export: boolean; //Export
}
