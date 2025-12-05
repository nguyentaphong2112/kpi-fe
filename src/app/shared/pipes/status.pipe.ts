import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusPipe',
})
export class StatusPipe implements PipeTransform {
  transform(status: any, listStatus: any[], _key: string = 'key', _value: string = 'value'): any {
    if (status != null && listStatus !== null && listStatus?.length > 0) {
      let value = status;
      listStatus.filter(item => {
        if (item[_key] == status) {
          value = item[_value];
        }
      });
      return value;
    }
    return status;
  }
}
