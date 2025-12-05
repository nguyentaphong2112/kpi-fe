import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'convertArrayString' })
export class ConvertArrayStringPipe implements PipeTransform {
  transform(value: string[]): string {
    if (!value) {
      return;
    }
    return value.join(', ');
  }
}
