import * as _ from 'lodash';
import { vi_VN } from 'ng-zorro-antd/i18n';

export const vi_VN_ext = _.merge(
  vi_VN, {
    DatePicker: {
      lang: {
        placeholder: 'Chọn thời gian',
        yearPlaceholder: 'Chọn năm',
        quarterPlaceholder: 'Chọn quý',
        monthPlaceholder: 'Chọn tháng',
        weekPlaceholder: 'Chọn tuần',
        ok: 'Chọn',
        rangePlaceholder: ['Ngày bắt đầu', 'Ngày kết thúc'],
        rangeYearPlaceholder: ['Năm bắt đầu', 'Năm kết thúc'],
        rangeMonthPlaceholder: ['Tháng bắt đầu', 'Tháng kết thúc'],
        rangeWeekPlaceholder: ['Tuần bắt đầu', 'Tuần kết thúc'],
        // Format
        dateFormat: 'dd/MM/yyyy',
        dateTimeFormat: 'dd/MM/yyyy hh:mm:ss',
        monthFormat: 'MM/yyyy',
        yearFormat: 'yyyy'
      }
    }
  }
);
