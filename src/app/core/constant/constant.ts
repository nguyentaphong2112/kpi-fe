import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

export const snackBarConfig = {
  duration: 2000,
  verticalPosition: 'top' as MatSnackBarVerticalPosition,
  horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
  panelClass: ['snackbar-style'],
};
export const DATA_TYPE = {
  org: 'ORG',
  prj: 'PRJ',
  line: 'LINE'
};
export const LIST_URI_SELF_SERVICE = [
  '/requests-manager/my-request', '/requests-manager/request-approve', '/personal-tax/tax-registers'
];
export const _1Mb = 1048576;
