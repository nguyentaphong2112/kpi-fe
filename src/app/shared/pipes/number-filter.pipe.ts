import { Pipe, PipeTransform } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Pipe({
  name: 'numberFilter'
})
export class NumberFilterPipe implements PipeTransform {
  transform(value: NzSafeAny): NzSafeAny {
    if (isNaN(value)) {
      return '-';
    }
    return value;
  }
}
