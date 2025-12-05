import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, length = 30, ending: string = '...'): string {
    if (value && value.length > length) {
      return value.substring(0, length - ending.length) + ending;
    }
    return value;
  }
}
