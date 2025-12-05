import { Component, Input } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { FormatCurrencyPipe } from '@app/shared/pipes/format-currency.pipe';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-control-messages',
  templateUrl: './control-messages.component.html',
})
export class ControlMessagesComponent {
  @Input()
  public control: FormControl;
  @Input()
  public labelName?: string;
  @Input()
  public fomatCurrency;
// tslint:disable-next-line: max-line-length
  private replaceKeys = ['max', 'min', 'maxlength', 'optionlength', 'minlength', 'dateNotAffter', 'dateNotAffterFix', 'dateNotBefore', 'duplicateArray', 'beforeCurrentDate', 'required', 'noSpecialCharacter'];
// tslint:disable-next-line: max-line-length
  private actualKeys = ['max', 'min', 'requiredLength', 'requiredLength', 'requiredLength', 'dateNotAffter', 'dateNotAffterFix', 'dateNotBefore', 'duplicateArray', 'beforeCurrentDate', 'required', 'noSpecialCharacter'];
  private translateKeys = ['dateNotAffter', 'dateNotAffterFix', 'dateNotBefore', 'duplicateArray', 'beforeCurrentDate', 'required', 'noSpecialCharacter'];

  constructor(public translation: TranslateService,
              private formatcurrencypipe: FormatCurrencyPipe) {
  }

  get errorMessage(): string {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        const messageText = this.translation.instant(`validate.${propertyName}`);
        const errors = this.control.errors[propertyName];
        return this.buildMessage(messageText, errors);
      }
    }
    return undefined;
  }

  markAsUntouched() {
    this.control.markAsUntouched();
  }

  /**
   * buildMessage
   * @param messageText: string
   * @param errors: ValidationErrors
   */
  buildMessage(messageText: string, errors: ValidationErrors): string {
    for (const i in this.replaceKeys) {
      if (errors && errors.hasOwnProperty(this.actualKeys[i])) {
        let text = errors[this.actualKeys[i]];
        if (this.translateKeys.indexOf(this.actualKeys[i]) !== -1) {
          text = this.translation.instant(text);
        } else {
          if (this.fomatCurrency) {
            text = this.formatcurrencypipe.transform(text);
          }
        }
        messageText = messageText.replace(new RegExp('\\$\\{' + this.replaceKeys[i] + '\\}', 'g'), text);
      }
    }
    return messageText;
  }
}
