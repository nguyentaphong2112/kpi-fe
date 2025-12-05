import * as _ from 'lodash';
import { en_US } from 'ng-zorro-antd/i18n';

export const en_US_ext = _.merge(
  en_US, {
    DatePicker: {
      lang: {
        // Format
        dateFormat: 'MM/dd/yyyy',
        dateTimeFormat: 'MM/dd/yyyy hh:mm:ss',
        monthFormat: 'MM/yyyy',
        yearFormat: 'yyyy'
      }
    }
  }
);
