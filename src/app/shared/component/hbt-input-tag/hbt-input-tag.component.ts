import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { noop } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { InputBoolean } from 'ng-zorro-antd/core/util';

export class ModelInput {
  groupType?: 'noIcon' | 'icon' | 'textarea' = 'noIcon';
  type?: 'default' | 'warning' | 'error' | 'success' = 'default';
  labelText?: string;
  textMessageValue?: string;
  showIcon?: boolean = true;
  placeholder?: string = '';
  suffixIcon?: 'search' | 'down' | string = null;
  prefixIcon?: 'search' | 'down' | string = null;
  prefixTemplate?: string | TemplateRef<any>;
  suffixTemplate?: string | TemplateRef<any>;
  autoSize?: { [key: string]: number } | boolean = { minRows: 4, maxRows: 4 };
  rows?: number;
  disable?: boolean;
  autofocus?: 'autofocus' | null; // Chưa hoạt động
  showFlexEnd?: boolean = true;
  showError?: boolean = false;
}

@Component({
  selector: 'hbt-input-tag',
  templateUrl: './hbt-input-tag.component.html',
  styleUrls: ['./hbt-input-tag.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtInputTagComponent)
    }
  ]
})
export class HbtInputTagComponent implements OnInit, OnChanges, ControlValueAccessor {

  inputValue = '';
  inputVisible = false;
  timeout: NzSafeAny;

  value: string | undefined;
  tags: string[] = [];
  ngControl?: NgControl;

  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  @Input() config: ModelInput = new ModelInput();
  @Input() newTagLabel = 'New Tag';
  @Input() labelText = '';
  @Input() disabled = false;
  @Input() placeholderText = '';
  @Input() isShowAddNewTag = true;
  @Input() type!: 'default' | 'warning' | 'error' | 'success';
  @Input() showError = false;
  @Input() errors: NzSafeAny;
  @Input() errorDefs!: { errorName: string; errorDescription: string }[];
  @Input() @InputBoolean() disable = false;
  @Input() prefixIcon: 'search' | 'calendar' | 'user';
  @Input() prefixTemplate: string | TemplateRef<any>;
  @Input() suffixIcon: 'down' | 'eye' | 'key';
  @Input() suffixTemplate: string | TemplateRef<any>;
  @Input() @InputBoolean() isTextAre = false;
  @Input() showFlexEnd = true;
  @Input() autofocus = false;
  @Input() showIconMessage = true;
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  onTouched: () => void = noop;
  onChange: (_: NzSafeAny) => void = noop;
  iconType!: string;
  isFocused: boolean = false;

  inputGroupClass = 'input__group';
  inputGroupGroupClass = 'input__group--group';
  inputTextClass = 'input__text';
  inputMessageClass = 'input__message';
  inputAreaClass = 'input__area';

  classGroup = {
    noIcon: 'input__group--no-icon',
    icon: 'input__group--icon'
  };

  classGroupGroup = {
    default: 'input__group--group--default',
    warning: 'input__group--group--warning',
    error: 'input__group--group--error',
    success: 'input__group--group--success'
  };

  classInput = {
    default: 'input__text--default',
    warning: 'input__text--warning',
    error: 'input__text--error',
    success: 'input__text--success'
  };

  classMessage = {
    default: 'input__message--default',
    warning: 'input__message--warning',
    error: 'input__message--error',
    success: 'input__message--success'
  };

  classIcon = {
    warning: 'warning',
    error: 'close-circle',
    success: 'check-circle'
  };

  constructor(
    private inj: Injector,
    private toastService: ToastrService
  ) {
    this.inputGroupClass = 'input__group' + ' ';
    this.inputGroupGroupClass = 'input__group--group' + ' ';
    this.inputTextClass = 'input__text' + ' ';
    this.inputMessageClass = 'input__message ' + ' ';
    this.inputAreaClass = 'input__area ' + ' ';
  }

  ngOnChanges() {
    this.inputGroupClass = 'input__group' + ' ';
    this.inputGroupGroupClass = 'input__group--group' + ' ';
    this.inputTextClass = 'input__text' + ' ';
    this.inputMessageClass = 'input__message ' + ' ';
    this.inputAreaClass = 'input__area ' + ' ';
    this.setConfig();
    this.configInput();
    this.setErrorMessage();
  }


  setConfig() {
    if (this.type) {
      this.config.type = this.type;
    }
    if (this.labelText) {
      this.config.labelText = this.labelText;
    }
    if (this.placeholderText) {
      this.config.placeholder = this.placeholderText;
    }
    this.config.disable = this.disable;
    if (this.prefixIcon) {
      this.config.groupType = 'icon';
      this.config.prefixIcon = this.prefixIcon;
    }
    if (this.prefixTemplate) {
      this.config.groupType = 'icon';
      this.config.prefixTemplate = this.prefixTemplate;
    }
    if (this.suffixIcon) {
      this.config.groupType = 'icon';
      this.config.suffixIcon = this.suffixIcon;
    }
    if (this.suffixTemplate) {
      this.config.groupType = 'icon';
      this.config.suffixTemplate = this.suffixTemplate;
    }
    if (this.autofocus) {
      this.config.autofocus = 'autofocus';
    }
    if (this.isTextAre) {
      this.config.groupType = 'textarea';
    }
    if (!this.showFlexEnd) {
      this.config.showFlexEnd = this.showFlexEnd;
    }
    this.config.showError = this.showError;
    this.config.showIcon = this.showIconMessage;
  }


  configInput() {
    if (this.config?.groupType === 'icon') {
      this.inputGroupClass += this.classGroup.icon;
    } else {
      this.inputGroupClass += this.classGroup.noIcon;
    }
    if (this.placeholderText) {
      this.config.placeholder = this.placeholderText;
    }
    switch (this.config?.type) {
      case 'default':
        this.inputGroupGroupClass += this.classGroupGroup.default;
        this.inputTextClass += this.classInput.default;
        this.inputMessageClass += this.classMessage.default;
        this.inputAreaClass += this.classInput.default;
        break;
      case 'warning':
        this.inputGroupGroupClass += this.classGroupGroup.warning;
        this.inputTextClass += this.classInput.warning;
        this.inputMessageClass += this.classMessage.warning;
        this.iconType = this.classIcon.warning;
        this.inputAreaClass += this.classInput.warning;
        break;
      case 'error':
        this.inputGroupGroupClass += this.classGroupGroup.error;
        this.inputTextClass += this.classInput.error;
        this.inputMessageClass += this.classMessage.error;
        this.iconType = this.classIcon.error;
        this.inputAreaClass += this.classInput.error;
        break;
      case 'success':
        this.inputGroupGroupClass += this.classGroupGroup.success;
        this.inputTextClass += this.classInput.success;
        this.inputMessageClass += this.classMessage.success;
        this.iconType = this.classIcon.success;
        this.inputAreaClass += this.classInput.success;
        break;
      default:
        this.inputGroupGroupClass += this.classGroupGroup.default;
        this.inputTextClass += this.classInput.default;
        this.inputMessageClass += this.classMessage.default;
        this.inputAreaClass += this.classInput.default;
        break;
    }
  }

  ngOnInit() {
    this.ngControl = this.inj.get(NgControl);
  }

  handleClose(removedTag: string): void {
    if (this.tags) {
      this.tags = this.tags.filter(tag => tag !== removedTag);
    }
    this.writeValue(this.tags);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 30;
    return isLongTag ? `${tag.slice(0, 30)}...` : tag;
  }

  showInput(): void {
    if (!this.disabled) {
      this.inputVisible = true;
      setTimeout(() => {
        this.inputElement?.nativeElement.focus();
      }, 10);
    }
  }

  handleInputConfirm(): void {
    if (this.tags) {
      if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
        this.tags = [...this.tags, this.inputValue];
      }
      this.inputValue = '';
      this.inputVisible = false;
      this.writeValue(this.tags);
    }
  }

  handleInputConfirmComma(event: KeyboardEvent): void {
    if (event.key === ',' || event.key === 'Comma') {
      event.preventDefault();
      this.handleInputConfirm();
    }
  }

  handleBackspace(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.inputValue && this.tags.length > 0) {
      event.preventDefault();
      this.tags.pop();
      this.writeValue(this.tags);
    }
  }

  registerOnChange(fn: NzSafeAny): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: NzSafeAny): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
    this.config.disable = isDisabled;
  }

  writeValue(obj: NzSafeAny): void {
    this.tags = obj ? obj : [];
    this.onChange(this.tags);
  }

  onInputChange($event: NzSafeAny) {
    this.onChange($event);
  }

  setErrorMessage() {
    if (this.errors) {
      for (const error of this.errorDefs) {
        const key = error.errorName;
        if (this.errors[key]) {
          this.config.textMessageValue = error.errorDescription;
        }
      }
    }
  }

  inputBlur($event: any) {
    this.isFocused = false;
    this.onTouched();
    this.blur.emit($event);
  }

  inputFocus($event: any) {
    this.isFocused = true;
  }

  /*registerOnValidatorChange(fn: () => void): void {
    this.onChange(fn);
  }

  validate(control: FormControl) {
    return null;
  }*/
}
