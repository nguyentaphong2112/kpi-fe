export class BookmarkModel {
  userBookmarkId: number;
  loginName: string;
  bookmarkType: string;
  name: string;
  options: any;
  listOptions: Option[];
}
export class Option {
  code: string;
  values: string[] | number[];
  valueFrom: string | null;
  valueTo: string;
}
