import { NzI18nService } from 'ng-zorro-antd/i18n';
import { TranslateService } from '@ngx-translate/core';
import { AfterViewInit, Directive, OnInit, Input } from '@angular/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import Inputmask from 'inputmask';

@Directive({
  selector: 'nz-date-picker[maskDate]',
})
export class MaskDateDirective implements OnInit, AfterViewInit {
  @Input() min: string;
  @Input() max: string;

  constructor(
    private el: NzDatePickerComponent,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.changeFormat();
    this.translateService.onLangChange.subscribe(change => {
      this.changeFormat();
      this.el.updateInputValue();
    });
  }

  changeFormat() {
    switch (this.el.nzMode) {
      case 'date':
        this.el.nzFormat = this.el.nzLocale.lang.dateFormat;
        break;
      case 'week':
        // this.el.nzFormat = this.el.nzLocale.lang.monthFormat;
        return;
      case 'month':
        this.el.nzFormat = this.el.nzLocale.lang.monthFormat;
        break;
      case 'year':
        this.el.nzFormat = this.el.nzLocale.lang.yearFormat;
        break;
      default:
        return;
    }
    this.setInputMask();
  }

  setInputMask() {
    Inputmask('datetime', {
      inputFormat: this.el.nzFormat.toLowerCase(),
      placeholder: this.el.nzFormat.replace(/[^\/]/gi, '_'),
      // min: this.min ? this.min : '',
      // max: this.max ? this.max : '',
      clearMaskOnLostFocus: true,
      isComplete: function(buffer: any, opts: any) {
        return true;
      },
    }).mask(this.el.pickerInput?.nativeElement as HTMLElement);
  }
}
