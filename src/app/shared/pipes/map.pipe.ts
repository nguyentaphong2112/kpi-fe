import { Pipe, PipeTransform } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzBytesPipe } from 'ng-zorro-antd/pipes';
import { DateFormatPipe } from './format-date.pipe';
import { FormatCurrencyPipe } from './format-currency.pipe';

export enum DateFormat {
  Date = 'dd/MM/yyyy',
  DateHour = 'dd/MM/yyyy HH',
  DateTime = 'dd/MM/yyyy HH:mm',
}

export enum MapKeyType {
  String,
  Number,
  Boolean
}

export interface MapItem {
  label: string;
  value: NzSafeAny;
}

@Pipe({
  name: 'map',
})
export class MapPipe implements PipeTransform {
  private datePipe: DateFormatPipe = new DateFormatPipe();
  private formatCurrencyPipe: FormatCurrencyPipe = new FormatCurrencyPipe();
  private bytesPipe: NzBytesPipe = new NzBytesPipe();

  static transformMapToArray(data: NzSafeAny, mapKeyType: MapKeyType = MapKeyType.Number): MapItem[] {
    return Object.keys(data || {}).map(key => {
      let value: NzSafeAny;
      switch (mapKeyType) {
        case MapKeyType.Number:
          value = Number(key) ?? 0;
          break;
        case MapKeyType.Boolean:
          value = key === 'true';
          break;
        case MapKeyType.String:
        default:
          value = key;
          break;
      }
      return { value, label: data[key] };
    });
  }

  transform(value: NzSafeAny, arg?: NzSafeAny): NzSafeAny {
    if (arg === undefined) {
      return value;
    }
    let type: string = arg;
    let param = '';
    if (arg.indexOf(':') !== -1) {
      type = arg.substring(0, arg.indexOf(':'));
      param = arg.substring(arg.indexOf(':') + 1, arg.length);
    }
    switch (type) {
      case 'date':
        return this.datePipe.transform(value, param) ?? '-';
      case 'currency':
        const currency = value != null && !isNaN(value) ? parseFloat(value).toLocaleString('en-US') : null;
        return currency != null ? currency : '-';
      case 'bytes':
        return this.bytesPipe.transform(value) ?? '-';
      case 'yn':
        return (value && value == 1) ? 'Có' : 'Không';
      default:
        // return (this.mapObj[type] ? this.mapObj[type][value] : '');
        return '-';
    }
  }
}
