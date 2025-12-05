import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'hbt-button',
  templateUrl: './hbt-button.component.html',
  styleUrls: ['../../../core/global-style/_button.scss']
})
export class HbtButtonComponent implements OnInit {
  @Input() buttonType: 'BORDER' | 'NO_BORDER' | 'ONLY_ICON' = 'BORDER';
  @Input() buttonSize: 'LARGE' | 'MEDIUM' | 'SMALL' | 'VERY_LARGE' = 'MEDIUM';
  @Input() type: 'SUBMIT' | 'BUTTON' = 'BUTTON';
  @Input() buttonBgColor = '#fff';
  @Input() buttonBorderColor = '#A0A3BD';
  @Input() buttonTextColor = '#6E7191';
  @Input() buttonShowVerticalDash = false;
  @Input() buttonVerticalDashColor = '#A0A3BD';
  private _isDisable = false;
  @Input() prefixIcon: null | string;
  @Input() buttonText: string;
  @Input() suffixIcon: null | string;
  @Input() buttonAvailableStyle: 'DEFAULT' | 'SEARCH' | 'ADD' | 'EDIT' | 'SAVE' | 'CANCEL' | 'APPROVE' | 'REJECT' | 'GRAY';
  @Input() buttonIsLoading = false;
  @Input() buttonIconType: 'ZORRO' | 'AWESOME' = 'ZORRO';
  buttonClass = 'button__class';
  style: any;
  styleDash: any;

  @Input() set isDisable(value: boolean) {
    this._isDisable = value;
    this.initButton();
  }

  get isDisable(): boolean {
    return this._isDisable;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.initButton();
  }

  initButton() {
    this.buttonClass = 'button__class';
    if (this.buttonType === 'BORDER') {
      this.buttonClass += ' ' + 'button__class--border';
    } else {
      this.buttonClass += ' ' + 'button__class--no-border';
    }

    if (this.buttonShowVerticalDash) {
      this.buttonClass += ' ' + 'button__class--show-dash';
    }

    this.buttonClass += ' ' + 'button__class--' + this.buttonSize.toLowerCase();
    const verticalDash = `${this.buttonVerticalDashColor}!important`;
    const heightVertical = this.buttonSize === 'LARGE' ? '40px' : this.buttonSize === 'MEDIUM' ? '35px' : '24px';

    if (this.buttonAvailableStyle) {
      this.buttonClass += ' ' + 'button__class__type-' + this.buttonAvailableStyle.toLowerCase();
      this.style = {'min-height': heightVertical };
    } else {
      this.style = { background: this.buttonBgColor, 'border-color': this.buttonBorderColor, color: this.buttonTextColor, 'min-height': heightVertical };
    }
    this.styleDash = { 'border-color': verticalDash, 'min-height': heightVertical };
  }
}
