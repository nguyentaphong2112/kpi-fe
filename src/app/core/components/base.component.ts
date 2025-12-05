import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef, Component, HostBinding, HostListener, Injector, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../services/session.service';
import { AppFunction } from '@core/models/app-function.interface';
import { PopupService } from '@shared/component/popup/popup.service';
import { UrlConstant } from '@app/shared/constant/url.class';
import { _variable } from '@core/global-style/_variable';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CATEGORY_CODE, Mode } from '@shared/constant/common';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  template: `
    <ng-content></ng-content>`
})
export class BaseComponent implements OnDestroy {
  public isNotPageName = false;
  public _variable = _variable;
  public prop: any;
  public fields: any;
  public isLoading = false;
  protected fb!: FormBuilder;
  protected router!: Router;
  protected route!: ActivatedRoute;
  protected location!: Location;
  protected ref!: ChangeDetectorRef;
  protected message!: NzMessageService;
  protected modal!: NzModalService;
  protected state!: any;
  protected translate!: TranslateService;
  protected toast!: ToastrService;
  protected sessionService!: SessionService;
  protected popupService!: PopupService;
  protected spinnerService!: SpinnerService;
  subscription!: Subscription;
  subscriptions: Subscription[] = [];
  objFunction: AppFunction;
  microService = MICRO_SERVICE;
  categoryCode = CATEGORY_CODE;
  modeConst = Mode;
  form!: FormGroup;
  @HostBinding('class.app__right-content') appRightContent = true;

  constructor(protected readonly injector: Injector) {
    this.init();
    this.state = this.router.getCurrentNavigation()?.extras?.state;
  }

  init() {
    this.fb = this.injector.get(FormBuilder);
    this.router = this.injector.get(Router);
    this.route = this.injector.get(ActivatedRoute);
    this.location = this.injector.get(Location);
    this.ref = this.injector.get(ChangeDetectorRef);
    this.message = this.injector.get(NzMessageService);
    this.toast = this.injector.get(ToastrService);
    this.modal = this.injector.get(NzModalService);
    this.translate = this.injector.get(TranslateService);
    this.sessionService = this.injector.get(SessionService);
    this.popupService = this.injector.get(PopupService);
    this.spinnerService = this.injector.get(SpinnerService);
  }

  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.triggerSearchEvent();
  }

  triggerSearchEvent() {
  }

  back() {
    this.location.back();
  }

  getMessageError(errorResponse: HttpErrorResponse) {
    if (errorResponse?.error?.message) {
      this.message.error(errorResponse?.error?.message);
    } else {
      this.message.error(this.translate.instant('shared.error.errorCode500'));
    }
  }

  getLabelText(labelText: string, isRequired: boolean) {
    let label = this.translate.instant(labelText);
    if (isRequired) {
      label += ' <span class=\'label__required\'>*</span>';
    }
    return label;
  }

  getUrlCategory(typeCode: string, isGetAttribute?: boolean, keyAttribute?: string): string {
    if (isGetAttribute) {
      if (keyAttribute) {
        return UrlConstant.GET_CATEGORIES.replace('{typeCode}', typeCode) + '?isGetAttribute=' + isGetAttribute + '&keyAttribute=' + keyAttribute;
      } else {
        return UrlConstant.GET_CATEGORIES.replace('{typeCode}', typeCode) + '?isGetAttribute=' + isGetAttribute;
      }
    }
    return UrlConstant.GET_CATEGORIES.replace('{typeCode}', typeCode);
  }

  handleDestroy() {
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscriptions?.forEach((sub) => {
      sub?.unsubscribe();
    });
    this.handleDestroy();
  }

  getNzWidth() {
    if (window.innerWidth > 767) {
      return window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5;
    }
    return window.innerWidth;
  }

  protected getModeTitle(mode: Mode): string {
    let title = '';
    switch (mode) {
      case Mode.ADD:
        title = this.translate.instant('common.title.add');
        break;
      case Mode.EDIT:
        title = this.translate.instant('common.title.edit');
        break;
      case Mode.VIEW:
        title = this.translate.instant('common.title.view');
        break;
    }
    return title;
  }

  onFileListChange(listFile: NzUploadFile[], formControlName: string, isMultiple?: boolean, formControl?: FormGroup | any) {
    if (formControl) {
      formControl.controls[formControlName]?.setValue(isMultiple ? listFile : listFile[0]);
    } else {
      this.form.controls[formControlName]?.setValue(isMultiple ? listFile : listFile[0]);
    }
  }
}
