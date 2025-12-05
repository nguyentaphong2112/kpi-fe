import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
import { parse } from 'date-fns';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'hbt-text-label',
  templateUrl: './hbt-text-label.component.html',
  styleUrls: ['../../../core/global-style/_text-label.scss']
})
export class HbtTextLabelComponent implements OnInit, OnChanges {
  @Input() valueType: 'string' | 'number' | 'date' | 'currency' | any = 'string';
  @Input() labelText: any;
  @Input() labelValue: any;
  @Input() showEdit = false;
  @Input() dateFormat: string = '';
  @Input() showLabelText = true;
  @Input() showLabelValue = true;
  @Input() placeholderText = '';
  @Input() prefixIcon: 'search' | 'calendar' | 'user' | string;
  @Input() suffixIcon: 'down' | 'eye' | 'key' | string;
  @Input() isInnerHTML = false;
  valueShow: any;
  dateFormatShow: any;

  constructor(
    private currencyFormat: FormatCurrencyPipe
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.configValue();
  }

  configValue() {
    this.dateFormatShow = this.dateFormat;
    if (this.dateFormat === '') {
      this.dateFormatShow = this.showEdit ? 'dd/MM/yyyy' : 'dd/MM/yyyy';
    }
    this.valueShow = this.labelValue;
    if (this.valueType === 'date') {
      this.valueShow = this.showEdit ? parse(this.labelValue, this.dateFormatShow, new Date()) : this.labelValue;
    }
    if (this.valueType === 'currency') {
      this.valueShow = this.showEdit ? this.labelValue : this.currencyFormat.transform(this.labelValue);
    }
  }
}
