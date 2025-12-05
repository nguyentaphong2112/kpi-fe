import { Directive, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzRangePickerComponent } from 'ng-zorro-antd/date-picker';

@Directive({
  selector: 'nz-range-picker[maskRangeDate]'
})
export class MaskRangeDateDirective {
  @Input() minFromDate: string;
  @Input() minEndDate: string;
  @Input() maxFromDate: string;
  @Input() maxEndDate: string;

  constructor(
    private el: NzRangePickerComponent,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.changeFormat();
    this.translateService.onLangChange.subscribe(change => {
      this.changeFormat();
      this.el.datePicker.updateInputValue();
    });
  }

  changeFormat() {
    switch (this.el.datePicker.nzMode) {
      case 'date':
        this.el.datePicker.nzFormat = this.el.datePicker.nzLocale.lang.dateFormat;
        break;
      case 'week':
        // this.el.nzFormat = this.el.nzLocale.lang.monthFormat;
        return;
      case 'month':
        this.el.datePicker.nzFormat = this.el.datePicker.nzLocale.lang.monthFormat;
        break;
      case 'year':
        this.el.datePicker.nzFormat = this.el.datePicker.nzLocale.lang.yearFormat;
        break;
      default:
        return;
    }
    this.setInputMask();
  }

  setInputMask() {
    // Range
    Inputmask('datetime', {
      inputFormat: this.el.datePicker.nzFormat.toLowerCase(),
      placeholder: this.el.datePicker.nzFormat.replace(/[^\/]/gi, '_'),
      // min: this.minFromDate ? this.minFromDate : '',
      // max: this.maxFromDate ? this.maxFromDate : '',
      clearMaskOnLostFocus: true,
      isComplete: function(buffer: any, opts: any) {
        return true;
      },
    }).mask(this.el.datePicker.rangePickerInputs?.first.nativeElement as HTMLElement);
    Inputmask('datetime', {
      inputFormat: this.el.datePicker.nzFormat.toLowerCase(),
      placeholder: this.el.datePicker.nzFormat.replace(/[^\/]/gi, '_'),
      // min: this.minEndDate ? this.minEndDate : '',
      // max: this.maxEndDate ? this.maxEndDate : '',
      clearMaskOnLostFocus: true,
      isComplete: function(buffer: any, opts: any) {
        return true;
      },
    }).mask(this.el.datePicker.rangePickerInputs?.last.nativeElement as HTMLElement);
    // End range
  }
}
